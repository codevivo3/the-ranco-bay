const expectedProjectId = '8aeezn2c'
const expectedDataset = 'development'

export const sanityApiVersion = '2026-10-01'

export const sanityProjectId =
  process.env.SANITY_PROJECT_ID || expectedProjectId
export const sanityDataset = process.env.SANITY_DATASET || expectedDataset
export const sanityStudioUrl =
  process.env.SANITY_STUDIO_URL || 'http://localhost:3333'

if (sanityProjectId !== expectedProjectId) {
  throw new Error(`Phase 2A must use Sanity project ${expectedProjectId}.`)
}

if (sanityDataset !== expectedDataset) {
  throw new Error(`Phase 2A must use the ${expectedDataset} dataset.`)
}
