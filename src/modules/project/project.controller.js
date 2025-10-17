import Project from "./project.model.js";

// GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("team", "name email role");
    res.status(200).json(projects);
  } catch (err) {
    console.error("Get Projects Error:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { title, description, status, deadline, team } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: "Title, description, and deadline are required" });
    }

    const project = await Project.create({
      title,
      description,
      status,
      deadline,
      team,
      createdBy: req.user._id, 
    });

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};
