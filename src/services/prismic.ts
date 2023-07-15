import * as prismic from '@prismicio/client';
import { NextApiRequestLike } from '@prismicio/next/dist/types';

export interface PrismicConfig {
  req?: NextApiRequestLike;
}

export function getPrismicClient(): prismic.Client {
  const client = prismic.createClient(process.env.PRISMIC_API_ENDPOINT);

  return client;
}
