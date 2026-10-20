import 'server-only'

import {createClient} from 'next-sanity'

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from './config'

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  perspective: 'published',
  useCdn: true,
})
