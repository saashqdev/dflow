import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name should be at-least than 1 character' })
    .max(10, { message: 'Name should be less than 10 characters' }),
  description: z.string().optional(),
  type: z.enum(['database', 'app', 'docker']),
  databaseType: z
    .enum(['postgres', 'mongo', 'mysql', 'redis', 'mariadb'])
    .optional(),
  projectId: z.string(),
})

export const deleteServiceSchema = z.object({
  id: z.string(),
  deleteBackups: z.boolean().optional(),
  deleteFromServer: z.boolean(),
})

export const updateServiceSchema = z.object({
  builder: z
    .enum([
      'nixpacks',
      'dockerfile',
      'herokuBuildPacks',
      'buildPacks',
      'railpack',
    ])
    .optional(),
  provider: z.string().optional(),
  providerType: z.enum(['github', 'gitlab', 'bitbucket']).optional(),
  githubSettings: z
    .object({
      repository: z.string(),
      owner: z.string(),
      branch: z.string(),
      buildPath: z.string(),
      port: z.number().default(3000),
    })
    .optional(),
  environmentVariables: z.record(z.string(), z.unknown()).optional(),
  noRestart: z.boolean().optional(),
  id: z.string(),
  dockerDetails: z
    .object({
      url: z.string(),
      account: z.string().optional(),
      ports: z
        .array(
          z.object({
            hostPort: z.number(),
            containerPort: z.number(),
            scheme: z.enum(['http', 'https']),
          }),
        )
        .optional(),
    })
    .optional(),
  variables: z
    .object({
      key: z
        .string()
        .min(1, 'Key must be at-least 1 character')
        .regex(
          /^[a-zA-Z_][a-zA-Z0-9_]*$/,
          'Invalid key format, special-characters & spaces are restricted',
        ),
      value: z.string().min(1, 'Value must be at-least 1 character'),
    })
    .array()
    .optional(),
})

export const exposeDatabasePortSchema = z.object({
  id: z.string(),
  action: z.enum(['expose', 'unexpose']),
})

export const updateServiceDomainSchema = z.object({
  domain: z.object({
    hostname: z.string(),
    autoRegenerateSSL: z.boolean(),
    certificateType: z.enum(['letsencrypt', 'none']),
    default: z.boolean().default(false).optional(),
  }),
  operation: z.enum(['add', 'remove', 'set']),
  id: z.string(),
})

export const regenerateSSLSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
})

export const restartServiceSchema = z.object({
  id: z.string(),
})

export const stopServiceSchema = z.object({
  id: z.string(),
})

export const updateVolumesSchema = z.object({
  id: z.string(),
  volumes: z
    .object({
      hostPath: z.string().min(1, 'Host path must be at-least 1 character'),
      containerPath: z
        .string()
        .min(1, 'Container path must be at-least 1 character'),
    })
    .array()
    .optional(),
})
