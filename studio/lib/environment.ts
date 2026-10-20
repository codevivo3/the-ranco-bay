function requireEnvironmentVariable(name: keyof ImportMetaEnv) {
  const value = import.meta.env[name]

  if (!value) {
    throw new Error(
      `Missing ${name}. Copy studio/.env.example to studio/.env.local and configure a development Sanity project.`,
    )
  }

  return value
}

export const projectId = requireEnvironmentVariable('SANITY_STUDIO_PROJECT_ID')
export const dataset = requireEnvironmentVariable('SANITY_STUDIO_DATASET')

const configuredPreviewOrigin =
  import.meta.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? 'http://localhost:3000'

export const previewOrigin = new URL(configuredPreviewOrigin).origin
