import { exitPreview } from '@prismicio/next';
import { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  return exitPreview({ req, res });
}
