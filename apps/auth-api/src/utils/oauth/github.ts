const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
import { GitHub } from "arctic";
const github = new GitHub(clientId, clientSecret);
export { github };
