'use client'

import Loader from '../Loader'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAction } from 'next-safe-action/hooks'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { updateRailpackAction } from '@/actions/server'
import updateRailpack from '@/lib/axios/updateRailpack'
import { ServerType } from '@/payload-types-overrides'

const Packages = ({
  railpack,
  serverId,
}: {
  railpack: ServerType['railpack']
  serverId: ServerType['id']
}) => {
  const [latestVersion, setLatestVersion] = useState<string>('')

  useEffect(() => {
    const fetchLatestVersion = async () => {
      const latestVersion = await updateRailpack()
      setLatestVersion(latestVersion)
    }

    fetchLatestVersion()
  }, [])

  const { execute: updateRailpackExecution, isPending: isUpdating } = useAction(
    updateRailpackAction,
    {
      onSuccess: data => {
        if (data.data?.success) {
          toast.success(data.data.message)
        } else {
          toast.info(data.data?.message)
        }
      },
      onError: error => {
        toast.error(error.error.serverError)
      },
    },
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-medium'>Update Packages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='flex items-start gap-1.5'>
            <Image
              src={'/images/railpack.png'}
              alt='Railpack'
              width={32}
              height={32}
            />
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg font-semibold'>
                Railpack
                {railpack && (
                  <span className='text-xs text-muted-foreground'>
                    installed: {railpack} | latest: {latestVersion}
                  </span>
                )}
              </div>
              <p className='text-sm text-muted-foreground'>
                This is the version of Railpack installed on your server.
              </p>
            </div>
          </div>

          <Button
            variant='outline'
            disabled={isUpdating || !railpack}
            onClick={() =>
              railpack &&
              updateRailpackExecution({ serverId, railpackVersion: railpack })
            }>
            {isUpdating ? <Loader className='h-4 w-4' /> : 'Update'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Packages
