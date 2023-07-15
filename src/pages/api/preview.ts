import { redirectToPreviewURL, setPreviewData } from '@prismicio/next';
import { NextApiRequest, NextApiResponse } from 'next';

import { createClient } from '../../prismicio';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({ req });

  await setPreviewData({ req, res });

  await redirectToPreviewURL({ req, res, client });
};
