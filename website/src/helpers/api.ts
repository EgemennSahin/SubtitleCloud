import {
  NextApiRequest,
  NextApiResponse,
  GetServerSidePropsContext,
} from "next";
import { getToken } from "./user";

export async function getUidFromReqRes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const context: GetServerSidePropsContext = {
    req: req,
    res: res,
    query: {},
    resolvedUrl: "",
  };

  const decodedToken = await getToken({ context });

  if (!decodedToken) {
    return null;
  }

  return decodedToken.uid;
}
