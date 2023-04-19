import express from "express";
import { prisma } from "db";

const router = express.Router();

//get users projects
router.get("/all", async (req: express.Request, res: express.Response) => {
  try {
    const { filter } = req.query;
    console.log(filter);
    const projects = await prisma.project.findMany({
      where: {
        ownerId: req!.session!.user!.id,
      },
      orderBy:
        filter === "name"
          ? { name: "asc" }
          : filter === "active"
          ? { active: "desc" }
          : { status: "desc" },
      include: {
        websites: {
          orderBy: {
            environment: "asc",
          },
        },
      },
    });
    res.status(200).json({ success: true, projects });
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "Something went wrong" });
  }
});

//get single project by id
router.get(
  "/single/:projectId",
  async (req: express.Request, res: express.Response) => {
    try {
      const project = await prisma.project.findUnique({
        where: {
          id: parseInt(req.params.projectId),
        },
        include: {
          owner: { select: { id: true } },
          websites: {
            orderBy: {
              url: "asc",
            },
          },
        },
      });
      if (project) {
        if (project.ownerId === req!.session!.user!.id) {
          res
            .status(200)
            .json({ success: true, project, websites: project.websites });
        } else {
          res.status(200).json({ success: false, message: "Unauthorizedsss" });
        }
      } else {
        res.status(200).json({ success: false, message: "Project not found" });
      }
    } catch (e) {
      res.status(200).json({ success: false, message: "Something went wrong" });
    }
  }
);

//new project
router.post("/new", async (req: express.Request, res: express.Response) => {
  const {
    name,
    github_url,
    language,
    description,
    active,
    image_url,
  } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: req!.session!.user!.id },
      include: { subscription: true, projects: true },
    });
    if (user) {
      if (
        user.projects.length >= 25 &&
        user.subscription &&
        user.subscription.plan === "Growth Plan"
      ) {
        res.status(500).json({
          success: false,
          message: "You can only create up to 25 projects",
        });
      } else {
        const project = await prisma.project.create({
          data: {
            name,
            github_url,
            language,
            description,
            active,
            image_url,
            ownerId: user.id,
            owner: {
              connect: { id: user.id },
            },
          },
        });
        res.status(200).json({ success: true, project });
      }
    } else {
      res.status(500).json({ success: false, message: "Unable to find user" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

//update project
router.post("/update", async (req: express.Request, res: express.Response) => {
  const { id, name, github_url, language, description, active, image_url } =
    req.body.project;
  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name,
        github_url,
        language,
        description,
        active,
        image_url,
      },
    });

    res.status(200).json({ success: true, project });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

//delete project
router.post("/delete", async (req: express.Request, res: express.Response) => {
  const { id } = req.body;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (project) {
      if (project.ownerId === req!.session!.user!.id) {
        await prisma.project.delete({
          where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({
          success: false,
          message: "You can only delete your own projects",
        });
      }
    } else {
      res.status(200).json({ success: false, message: "Project not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

export default router;
