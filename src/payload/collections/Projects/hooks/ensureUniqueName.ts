import type { FieldHook, Where } from 'payload'

import { extractID } from '@/lib/extractID'
import { generateRandomString } from '@/lib/utils'

export const ensureUniqueName: FieldHook = async ({
  data,
  originalDoc,
  req,
  value,
}) => {
  // if value is unchanged, skip validation
  if (originalDoc?.name === value) {
    return value
  }

  const constraints: Where[] = [
    {
      name: {
        equals: value,
      },
    },
  ]

  const incomingTenantID = extractID(data?.tenant)
  const currentTenantID = extractID(originalDoc?.tenant)
  const tenantIDToMatch = incomingTenantID || currentTenantID

  if (tenantIDToMatch) {
    constraints.push({
      tenant: {
        equals: tenantIDToMatch,
      },
    })
  }

  const { docs: duplicateSevers } = await req.payload.find({
    collection: 'projects',
    where: {
      and: constraints,
    },
  })

  // if character limit is greater than 10 slicing the name
  const slicedName = value?.slice(0, 10)

  if (duplicateSevers.length > 0 && req.user) {
    // add a 4-random character generation
    const uniqueSuffix = generateRandomString({ length: 4 })
    return `${slicedName}-${uniqueSuffix}`
  }

  return slicedName
}
