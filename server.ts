import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initial data structure
const initialData = {
  supplies: [
    { id: "S001", itemName: "A4 Paper", category: "Stationery", quantity: 50, unit: "Reams", reorderLevel: 10 },
    { id: "S002", itemName: "Ballpoint Pens", category: "Stationery", quantity: 5, unit: "Boxes", reorderLevel: 15 },
    { id: "S003", itemName: "Surgical Masks", category: "Medical", quantity: 200, unit: "Pieces", reorderLevel: 50 },
  ],
  equipment: [
    { id: "E001", name: "Dell Latitude Laptop", category: "IT", status: "Available", assignedTo: "", dateAssigned: "" },
    { id: "E002", name: "HP LaserJet Printer", category: "IT", status: "In Use", assignedTo: "John Doe", dateAssigned: "2024-03-10" },
  ],
  transactions: [
    { id: "T001", type: "IN", item: "A4 Paper", quantity: 20, date: "2024-03-15T10:00:00Z" },
    { id: "T002", type: "OUT", item: "Surgical Masks", quantity: 50, date: "2024-03-16T14:30:00Z" },
  ],
  requests: [
    { id: "R001", requestor: "Jane Smith", department: "HR", item: "A4 Paper", quantity: 2, date: "2024-03-17T09:00:00Z", status: "Pending" },
  ]
};

// Helper to read/write data
function getData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/dashboard", (req, res) => {
    const data = getData();
    const lowStockItems = data.supplies.filter((s: any) => s.quantity <= s.reorderLevel);
    res.json({
      totalSupplies: data.supplies.length,
      totalEquipment: data.equipment.length,
      lowStockCount: lowStockItems.length,
      recentTransactions: data.transactions.slice(-10).reverse(),
      lowStockItems: lowStockItems
    });
  });

  // Supplies CRUD
  app.get("/api/supplies", (req, res) => res.json(getData().supplies));
  app.post("/api/supplies", (req, res) => {
    const data = getData();
    const newSupply = { ...req.body, id: `S${String(data.supplies.length + 1).padStart(3, '0')}` };
    data.supplies.push(newSupply);
    saveData(data);
    res.json(newSupply);
  });
  app.put("/api/supplies/:id", (req, res) => {
    const data = getData();
    const index = data.supplies.findIndex((s: any) => s.id === req.params.id);
    if (index !== -1) {
      data.supplies[index] = { ...data.supplies[index], ...req.body };
      saveData(data);
      res.json(data.supplies[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/supplies/:id", (req, res) => {
    const data = getData();
    data.supplies = data.supplies.filter((s: any) => s.id !== req.params.id);
    saveData(data);
    res.json({ success: true });
  });

  // Equipment CRUD
  app.get("/api/equipment", (req, res) => res.json(getData().equipment));
  app.post("/api/equipment", (req, res) => {
    const data = getData();
    const newEquip = { ...req.body, id: `E${String(data.equipment.length + 1).padStart(3, '0')}` };
    data.equipment.push(newEquip);
    saveData(data);
    res.json(newEquip);
  });
  app.put("/api/equipment/:id", (req, res) => {
    const data = getData();
    const index = data.equipment.findIndex((e: any) => e.id === req.params.id);
    if (index !== -1) {
      data.equipment[index] = { ...data.equipment[index], ...req.body };
      saveData(data);
      res.json(data.equipment[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/equipment/:id", (req, res) => {
    const data = getData();
    data.equipment = data.equipment.filter((e: any) => e.id !== req.params.id);
    saveData(data);
    res.json({ success: true });
  });

  // Transactions
  app.get("/api/transactions", (req, res) => res.json(getData().transactions));
  app.post("/api/transactions", (req, res) => {
    const data = getData();
    const { type, item, quantity } = req.body;
    const newTx = { 
      id: `T${String(data.transactions.length + 1).padStart(3, '0')}`,
      type, item, quantity, date: new Date().toISOString()
    };
    
    // Update supply quantity
    const supply = data.supplies.find((s: any) => s.itemName === item);
    if (supply) {
      if (type === "IN") supply.quantity += Number(quantity);
      if (type === "OUT") supply.quantity -= Number(quantity);
    }

    data.transactions.push(newTx);
    saveData(data);
    res.json(newTx);
  });

  // Requests
  app.get("/api/requests", (req, res) => res.json(getData().requests));
  app.post("/api/requests", (req, res) => {
    const data = getData();
    const newRequest = { 
      ...req.body, 
      id: `R${String(data.requests.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString(),
      status: "Pending"
    };
    data.requests.push(newRequest);
    saveData(data);
    res.json(newRequest);
  });
  app.put("/api/requests/:id", (req, res) => {
    const data = getData();
    const index = data.requests.findIndex((r: any) => r.id === req.params.id);
    if (index !== -1) {
      const oldStatus = data.requests[index].status;
      const newStatus = req.body.status;
      
      // If released, update stock
      if (oldStatus !== "Released" && newStatus === "Released") {
        const supply = data.supplies.find((s: any) => s.itemName === data.requests[index].item);
        if (supply) {
          supply.quantity -= data.requests[index].quantity;
          // Log transaction
          data.transactions.push({
            id: `T${String(data.transactions.length + 1).padStart(3, '0')}`,
            type: "OUT",
            item: supply.itemName,
            quantity: data.requests[index].quantity,
            date: new Date().toISOString()
          });
        }
      }

      data.requests[index] = { ...data.requests[index], ...req.body };
      saveData(data);
      res.json(data.requests[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
