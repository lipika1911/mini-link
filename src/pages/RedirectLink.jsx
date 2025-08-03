import { storeClicks } from '@/db/apiClicks';
import { getLongUrl} from '@/db/apiUrls';
import UseFetch from '@/hooks/UseFetch';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';

const RedirectLink = () => {

  const {id} = useParams();
  
  const {loading, data, fn} = UseFetch(getLongUrl, id);

  const {loading: loadingStats, fn: fnStats} = UseFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  })

  useEffect(()=>{
    fn()
  },[])

  useEffect(()=>{
    if(!loading && data){
      fnStats();
    }
  },[loading])

  if (loading || loadingStats){
    return(
      <>
        <BarLoader className='mx-16' width={"100%"} color='#36d7b7' />
        <br />
        <div className='mx-16'>
          Redirecting...
        </div>
      </>
    )
  }

  return null
}

export default RedirectLink



