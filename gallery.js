async function loadGallery(){
  const fallback=[
    {type:'image',src:'assets/images/experience1.jpg',description:'Working on conveyor systems'},
    {type:'video',src:'assets/videos/Experience1.Mp4',description:'Testing new system installations'},
    {type:'image',src:'assets/images/conveyor1.jpg',description:'Conveyor system project'},
    {type:'image',src:'assets/images/car_turntable1.jpg',description:'Car turntable maintenance'},
    {type:'image',src:'assets/images/kardex1.jpg',description:'Kardex automated sorting system'},
    {type:'image',src:'assets/images/site_management1.jpg',description:'Site management and engineering coordination'}
  ];
  let media=fallback;
  try{const res=await fetch('data/gallery.json'); if(res.ok) media=await res.json();}catch(e){}
  document.getElementById('gallery').innerHTML=media.map(item=>{
    const mediaTag=item.type==='video'?`<video controls preload="metadata"><source src="${item.src}" type="video/mp4">Your browser does not support the video tag.</video>`:`<img src="${item.src}" alt="${item.description}">`;
    return `<article class="item">${mediaTag}<div class="caption">${item.description}</div></article>`;
  }).join('');
}
loadGallery();
