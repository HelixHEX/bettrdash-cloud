import { prisma } from "db";
import express from "express";

const router = express.Router();

router.get("/all", async (req: express.Request, res: express.Response) => {
  try {
    const websites = await prisma.website.findMany({
      where: { owner: { id: req!.session!.user!.id } },
    });

    res.status(200).json({ success: true, websites });
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "Something went wrong" });
  }
});

router.get(
  "/all/:projectId",
  async (_req: express.Request, res: express.Response) => {
    try {
      let project = await prisma.project.findUnique({
        where: { id: parseInt(_req.params.projectId) },
        include: { websites: { orderBy: { url: "asc" } } },
      });
      if (project) {
        if (project?.ownerId === _req!.session!.user!.id) {
          res.status(200).json({
            success: true,
            websites: project.websites,
            projectName: project.name,
          });
        } else {
          res.status(200).json({ success: false, message: "Unauthorized" });
        }
      } else {
        res.status(200).json({ success: false, message: "Project not found" });
      }
    } catch (e) {
      console.log(e);
      res.status(200).json({ success: false, message: "Something went wrong" });
    }
  }
);

router.post("/new", async (req: express.Request, res: express.Response) => {
  const { url, environment, projectId } = req.body;
  // const { url } = req.body;
  try {
    if (url) {
      const user = await prisma.user.findUnique({
        where: { id: req!.session!.user!.id },
        include: { subscription: true },
      });

      if (user) {
        if (projectId) {
          const project = await prisma.project.findUnique({
            where: { id: projectId },
          });
          if (project) {
            if (project.ownerId === user.id) {
              const websiteProjects = await prisma.website.findMany({
                where: {
                  AND: [{ ownerId: req!.session!.user!.id }, { projectId }],
                },
              });
              if (
                user.subscription &&
                (user.subscription.plan === "Growth Plan" ||
                  user.subscription.subscriptionId.includes("override"))
              ) {
                if (websiteProjects.length >= 10) {
                  res.status(200).json({
                    success: false,
                    message:
                      "You can only add up to 10 websites that are associated to a project",
                  });
                } else {
                  await prisma.website.create({
                    data: {
                      url,
                      environment,
                      owner: { connect: { id: req!.session!.user!.id } },
                      project: { connect: { id: projectId } },
                    },
                  });
                  res.status(200).json({ success: true });
                }
              } else {
                if (websiteProjects.length >= 2) {
                  res.status(200).json({
                    success: false,
                    message:
                      "You can only add up to 2 websites that are associated to a project",
                  });
                } else {
                  await prisma.website.create({
                    data: {
                      url,
                      environment,
                      owner: { connect: { id: req!.session!.user!.id } },
                      project: { connect: { id: projectId } },
                    },
                  });
                  res.status(200).json({ success: true });
                }
              }
            } else {
              res.status(200).json({ success: false, message: "Unauthorized" });
            }
          } else {
            res
              .status(200)
              .json({ success: false, message: "Project not found" });
          }
        } else {
          const websites = await prisma.website.findMany({
            where: {
              AND: [{ ownerId: req!.session!.user!.id }, { projectId: null }],
            },
          });
          if (
            user.subscription &&
            (user.subscription.plan === "Growth Plan" ||
              user.subscription.subscriptionId.includes("override"))
          ) {
            if (websites.length >= 10) {
              res.status(200).json({
                success: false,
                message:
                  "You can only add up to 10 websites that aren't associated to a project",
              });
            } else {
            }
          } else {
            if (websites.length >= 3) {
              res.status(200).json({
                success: false,
                message:
                  "You can only add up to 3 websites that aren't associated to a project",
              });
            } else {
              await prisma.website.create({
                data: {
                  url,
                  environment,
                  owner: { connect: { id: req!.session!.user!.id } },
                },
              });
              res.status(200).json({ success: true });
            }
          }
        }
      } else {
        res.status(200).json({ success: false, message: "User not found" });
      }
    } else {
      res.status(200).json({ success: false, message: "Missing url field" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "Something went wrong" });
  }
});

// router.post("/new", async (req: express.Request, res: express.Response) => {
//   const { url, environment, projectId } = req.body;
//   try {
//     if (url) {
//       const user = await prisma.user.findUnique({
//         where: { id: req!.session!.user!.id },
//         include: {
//           subscription: true,
//           websites: { where: { projectId: null } },
//         },
//       });
//       if (user) {
//         if (user.subscription && user.subscription.plan === "Growth Plan") {
//           if (projectId) {

//           }
//         } else if (user.websites.length >= 3) {
//           res.status(500).json({
//             success: false,
//             message:
//               "You can only add up to 3 websites that aren't associated to a project",
//           });
//         }
//         // if (!projectId) {

//         // } else {
//         //   const website = await prisma.website.create({
//         //     data: {
//         //       url,
//         //       environment,
//         //       owner: { connect: { id: req!.session!.user!.id } },
//         //     },
//         //   });
//         const project = await prisma.project.findUnique({
//           where: { id: projectId },
//           include: { websites: true },
//         });
//         if (project) {
//           if (project.websites.length === 0) {
//             await prisma.website.update({
//               where: { id: website.id },
//               data: {
//                 default: true,
//                 project: { connect: { id: project.id } },
//               },
//             });
//             await prisma.project.update({
//               where: { id: project.id },
//               data: {
//                 defaultWebsiteId: website.id,
//                 websites: { connect: { id: website.id } },
//               },
//             });
//           } else {
//             await prisma.project.update({
//               where: { id: project.id },
//               data: {
//                 websites: { connect: { id: website.id } },
//               },
//             });
//           }
//         }
//         //   res.status(200).json({ success: true, website });
//         // }
//       } else {
//         res.status(500).json({ success: false, message: "User not found" });
//       }
//     } else {
//       res.status(200).json({ success: false, message: "Missing url field" });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(200).json({ success: false, message: "Something went wrong" });
//   }
// });

router.post("/update", async (req: express.Request, res: express.Response) => {
  const { url, environment, id } = req.body;
  const makeDefault = req.body.default;

  try {
    const website = await prisma.website.findUnique({
      where: { id },
      include: { project: true },
    });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        const updatedWebsite = await prisma.website.update({
          where: { id: website.id },
          data: {
            url,
            environment,
            default: makeDefault,
          },
        });
        if (makeDefault && website.projectId) {
          let project = await prisma.project.findUnique({
            where: { id: website.projectId },
          });
          if (project) {
            if (project.defaultWebsiteId) {
              await prisma.website.update({
                where: { id: project.defaultWebsiteId },
                data: { default: false },
              });
            }
            await prisma.project.update({
              where: { id: project.id },
              data: {
                defaultWebsiteId: updatedWebsite.id,
              },
            });
            res.status(200).json({ success: true });
          } else {
            res
              .status(200)
              .json({ success: false, message: "Error updating website" });
          }
        } else if (website.project) {
          if (
            website.project.defaultWebsiteId === website.id &&
            makeDefault === false
          ) {
            await prisma.project.update({
              where: { id: website.project.id },
              data: {
                defaultWebsiteId: null,
              },
            });
            res.status(200).json({ success: true });
          } else {
            res.status(200).json({ success: true });
          }
        } else {
          res.status(200).json({ success: true });
        }
      }
    } else {
      res.status(200).json({ success: false, message: "Website not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "Something went wrong" });
  }
});

router.post("/delete", async (req: express.Request, res: express.Response) => {
  const { id } = req.body;
  console.log(id);
  try {
    const website = await prisma.website.findUnique({
      where: { id },
      include: { project: true },
    });
    if (website) {
      if (website.ownerId === req!.session!.user!.id) {
        await prisma.website.delete({
          where: { id: website.id },
        });
        if (website.project) {
          if (website.project.defaultWebsiteId === website.id) {
            await prisma.project.update({
              where: { id: website.project.id },
              data: {
                defaultWebsiteId: null,
              },
            });
          }
        }
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false, message: "Unauthorized" });
      }
    } else {
      res.status(200).json({ success: false, message: "Website not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "Something went wrong" });
  }
});

//migrate live_url to website
// router.post("/migrate", async (_req, res: express.Response) => {
//   try {
//     const projects = await prisma.project.findMany();
//     for (let i = 0; i < projects.length; i++) {
//       const project = projects[i];
//       if (project.live_url) {
//         if (project.live_url.length > 0) {
//           await prisma.website.create({
//             data: {
//               url: project.live_url,
//               environment: "production",
//               project: { connect: { id: project.id } },
//               owner: { connect: { id: project.ownerId } },
//               default: true,
//             },
//           });
//           await prisma.project.update({
//             where: { id: project.id },
//             data: {
//               live_url: null,
//               defaultWebsiteId: 2,
//             },
//           });
//         }
//       }
//     }
//     res.json({ success: true });
//   } catch (e) {
//     console.log(e);
//     res.status(200).json({ success: false, message: "Something went wrong" });
//   }
// });

export default router;
