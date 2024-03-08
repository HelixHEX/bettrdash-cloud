import { Center, Grid, GridItem } from '@chakra-ui/react';
import { useProjects } from '../../lib/api/queries'
import ProjectCard from './projectCard';

const Projects = () => {
  const { data, isPending } = useProjects("name")
  const projects = data?.projects;

  if (isPending) return null;
  return (
    <Grid
      w="100%"
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      autoRows={"inherit"}
      gap={20}
      mt={20}
    >
      {projects.map((project: ProjectProps, index: number) => (
        <GridItem key={index}>
          <Center>
            <ProjectCard {...project} />
          </Center>
        </GridItem>
      ))}
    </Grid>
  )
}

export default Projects
