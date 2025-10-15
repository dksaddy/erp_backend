// src/modules/employees/employee.controller.js

// ✅ GET all employees (protected)
export const getEmployees = async (req, res) => {
  try {
    // You can test if middleware works by checking req.user
    res.status(200).json({
      message: "Employee list fetched successfully",
      user: req.user, // shows who is logged in
      employees: [
        { id: 1, name: "John Doe", position: "Manager" },
        { id: 2, name: "Jane Smith", position: "Developer" },
      ],
    });
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create new employee (protected)
export const createEmployee = async (req, res) => {
  try {
    const { name, position } = req.body;

    if (!name || !position) {
      return res.status(400).json({ message: "Name and position are required" });
    }

    // Dummy employee creation
    const newEmployee = {
      id: Math.floor(Math.random() * 1000),
      name,
      position,
      createdBy: req.user.role, // show who created it
    };

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ message: "Server error" });
  }
};
