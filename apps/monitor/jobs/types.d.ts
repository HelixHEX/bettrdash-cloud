import {Prisma} from '@bettrdash/db';

type WebsitesWithProjects = Prisma.WebsiteGetPayload<{
    include: {
        project: true
    }
}>