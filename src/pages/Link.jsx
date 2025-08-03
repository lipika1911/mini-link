import { UrlState } from '@/Context';
import { getClicksForUrl } from '@/db/apiClicks';
import { deleteUrl, getUrl } from '@/db/apiUrls';
import UseFetch from '@/hooks/UseFetch';
import { LinkIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BarLoader,  BeatLoader } from 'react-spinners';
import { Copy,Download, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LocationStats from '@/components/LocationStats';
import DeviceStats from '@/components/DeviceStats';

const Link = () => {

  const {id} = useParams();
  const { user, frontendUrl } = UrlState();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${frontendUrl}/${url?.short_url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);
  };

  const {loading, data:url, fn, error} = UseFetch(getUrl, {id, user_id: user?.id});
  const {loading: loadingStats, data: stats, fn: fnStats} = UseFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn:fnDelete} = UseFetch(deleteUrl,id);

  useEffect(()=>{
    fn();
    fnStats();
  },[])

  if(error){
    navigate('/dashboard');
  }

  let link = "";
  if(url){
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className='mx-16 mb-4' width={"100%"} color='#36d7b7' />
      )}
      <div className='mx-16 mt-4 flex flex-col gap-8 sm:flex-row justify-between'>
        <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5'>
          <span className='text-6xl font-extrabold hover:underline cursor-pointer'>{url?.title}</span>
          <a 
            href={`${frontendUrl}/${link}`} 
            target='_blank' 
            rel='noopener noreferrer'
            className='text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer'
          >
            {`${frontendUrl}/${link}`}
          </a>
          <a 
            href={url?.original_url} 
            target='_blank' 
            className='flex items-center gap-1 hover:underline cursor-pointer'
          >
            <LinkIcon className='p-1' />
            {url?.original_url}
          </a>
          <span className='flex items-end font-extralight text-sm'>
            {new Date(url?.created_at).toLocaleString()}
          </span>
          <div className='relative flex gap-2'>
            <div className='relative'>
              <Button 
                variant="ghost"
                onClick={handleCopy}
              >
                <Copy />
              </Button>
              {copied && (
                <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-green-600 text-white px-2 py-0.5 text-xs rounded shadow-md whitespace-nowrap z-10'>
                  Link copied!
                </div>
              )}
            </div>
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
                          onClick={() => fnDelete()}
                      >
                          Delete
                      </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
          <img 
            src={url?.qr}
            className='w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain'
            alt='QR Code'
          />
        </div>
        <Card className='sm:w-3/5'>
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Statistics</CardTitle>
          </CardHeader>
          {stats && stats?.length?(
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>
              <CardTitle>Location Data</CardTitle>
              <LocationStats stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ):(
            <CardContent>
              {loadingStats === false 
                ? "No statistics yet" 
                : "Loading Statistics..."
              }
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

export default Link

