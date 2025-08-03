import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Copy, Download, Trash } from 'lucide-react'
import UseFetch from '@/hooks/UseFetch'
import { deleteUrl } from '@/db/apiUrls'
import { BeatLoader } from 'react-spinners'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UrlState } from '@/Context'

const LinkCard = ({ url, fetchUrls }) => {
  const { frontendUrl } = UrlState()
  const [copied, setCopied] = useState(false)

  const downloadImage = () => {
    const imageUrl = url?.qr
    const fileName = url?.title

    const anchor = document.createElement("a")
    anchor.href = imageUrl
    anchor.download = fileName
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const { loading: loadingDelete, fn: fnDelete } = UseFetch(deleteUrl, url?.id)
  const shortLink = `${frontendUrl}/${url?.custom_url || url?.short_url}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 500)
  }

  return (
    <div className='relative flex flex-column md:flex-grow gap-5 border p-4 bg-gray-900 rounded-lg'>
      {copied && (
        <div className='absolute top-15 right-20 bg-green-600 text-white px-3 py-1 rounded shadow-md text-sm z-10'>
          Link copied!
        </div>
      )}

      <div className='flex flex-row md:flex-grow gap-5 bg-gray-900 rounded-lg '>
        <img
          src={url?.qr}
          alt="QR code"
          className='h-32 object-contain ring ring-blue-500 self-start'
        />
        <Link to={`/link/${url?.id}`} className='flex flex-col flex-1'>
          <span className='text-3xl font-extrabold hover:underline cursor-pointer'>
            {url?.title}
          </span>
          <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer break-all'>
            {shortLink}
          </span>
          <span className='flex items-center gap-1 hover:underline cursor-pointer break-all'>
            {url.original_url}
          </span>
          <span className='flex items-end font-extralight text-sm flex-1'>
            {new Date(url?.created_at).toLocaleString()}
          </span>
        </Link>
      </div>
      <div className='flex gap-2'>
        <Button variant="ghost" onClick={handleCopy}>
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost">
              {loadingDelete ? <BeatLoader size={5} color='white' /> : <Trash />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[90vw] max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => fnDelete().then(() => fetchUrls())}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default LinkCard
