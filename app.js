const {json , select, selectAll, geoOrthographic, geoPath,geoGraticule} = d3

let geoJson , globe, projection, path,graticule,infoPanel,isMouseDown=false,rotation={x : 0, y : 0}

const geoSize={
    w:window.innerWidth/2.5,
    h:window.innerHeight
}



json('https://assets.codepen.io/911796/custom.geo.json').then(data=>init(data))

const init = data =>{
    geoJson = data
    drawGlobe()
    drawGraticule()
    renderInfoPanel()
    createHoverEffect()
    createDraggingEvents()
}
const  drawGraticule=()=>{
    graticule = geoGraticule()

    globe
    .append('path')
    .attr('class','graticule')
    .attr('d',path(graticule()))
    .style('fill', 'none')
    .style('stroke', '#444')
}

const drawGlobe =()=>{ 
    globe =select('body')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)

    projection = geoOrthographic()
    .fitSize([geoSize.w,geoSize.h],geoJson)
    .translate([window.innerWidth - geoSize.w/1.5, window.innerHeight/2])

    path=geoPath().projection(projection)

    globe
    .selectAll('path')
    .data(geoJson.features)
    .enter().append('path')
    .attr('d',path)
    .style('fill', '#33415c')
    .style('stroke', '#000')
    .attr('class','country')
}

const renderInfoPanel = ()=>infoPanel =select('body').append('article').attr('class','info')
const createHoverEffect =()=>{
    globe
    .selectAll('.country')
    .on('mouseover',function(e,d){
        console.log(d.properties);
        const{formal_en,economy,pop_est,type,continent,abbrev} = d.properties
        console.log(formal_en,economy);
        infoPanel.html(`<h1>${formal_en}</h1>
        <hr/><h2> ${abbrev}</h2>
        <hr/><h3> ${continent}</h3>
        <hr/><h3>${type}</h3>
        <hr/><h3>${pop_est.toLocaleString()}</h3>
        <hr/><p>economy: ${economy}</p>`)
        globe.selectAll('.country').style('fill','#33415c').style('stroke', '#000')
        select(this).style("fill",'#3341ff').style('stroke', '#fff')
    })
}

const createDraggingEvents =()=>{
    globe
    .on('mousedown',()=>isMouseDown =true)
    .on('mouseup',()=>isMouseDown =false)
    .on('mousemove',(e)=>{
        if(isMouseDown){
            
            const {movementX,movementY}=e;
            rotation.x += movementX/3
            rotation.y += movementY/3
            projection.rotate([rotation.x,rotation.y])
            selectAll('.country').attr('d',path)
            selectAll('.graticule').attr('d',path(graticule()))
        }
    })
}


// var zoom = d3.behavior.zoom()
//     .translate(projection.translate())
//     .scale(projection.scale())
//     .scaleExtent([geoSize.h, 8 * geoSize.h])
//     .on("zoom", zoomed);
//     function zoomed() {
//         projection.translate(d3.event.translate).scale(d3.event.scale);
//         g.selectAll("path").attr("d", path);
//       }