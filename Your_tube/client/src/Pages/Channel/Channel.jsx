import React from 'react'
import Describechannel from './Describechannel'
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar'
import Showvideogrid from '../../Component/Showvideogrid/Showvideogrid'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Channel = ({seteditcreatechanelbtn,setvideouploadpage}) => {
  const {cid}=useParams()
  const vids=useSelector(state=>state.videoreducer)?.data?.filter(q=>q?.videochanel===cid).reverse();

  console.log("cid from URL:", cid);
  console.log(
    "All videos from Redux:",
    useSelector((state) => state.videoreducer)
  );
  console.log("Filtered videos:", vids);

  return (
    <div className="container_Pages_App">
      <Leftsidebar/>
      <div className="container2_Pages_App">
        <Describechannel cid={cid} setvideouploadpage={setvideouploadpage} seteditcreatechanelbtn={seteditcreatechanelbtn}/>
        <Showvideogrid vids={vids}/>
      </div>
    </div>
  )
}

export default Channel