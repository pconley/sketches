var server_table;
var server_row_index = 0;

function preload() {
  set_global_colors();
  console.log("preload");
  server_table = load_table("data1"); 
  // no code here; the table is loaded async
}

function setup() {
  console.log("setup")
  frameRate(60);
  createCanvas(900,600); // w,h
}

const movement_speed = 10; 

r = 200 
x0 = 200
y0 = 250

zones= []
hsms = []
servers = []
clusters = []

function draw() {
  if( frameCount%10 == 0 ) console.log("draw", frameCount);

  process_server_file(frameCount)

  background(100); // clears canvas

  push(); // save draw state

  draw_zone_ring(zones, x0, y0, r);

  // temp: where to place the hsms on the ring
  let angles = [30, 10, 45, 35, 60, 38, 75, 67];

  const draw_dot_on_ring = (rad, theta, color) => {
    x = x0 + rad * cos(theta)
    y = y0 + rad * sin(theta)
    stroke(color); fill(color); //noFill();
    circle(x, y, 20);
  };

  const draw_cluster = (cluster, hue) => {
    cluster.hsms.forEach((h,i)=>{
      const alpha = h.position;
      draw_dot_on_ring(r-5, alpha, hue)
      stroke(hue); noFill();
      cluster.hsms.forEach((hh,j)=>{
        if( h != hh ){
          beta = hh.position;
          pa = loc(alpha, x0, y0, r+300)
          p1 = loc(alpha, x0, y0, r-10)
          p2 = loc(beta, x0, y0, r-10)
          pz = loc(beta, x0, y0, r+300)
          curve(pa[0], pa[1], p1[0], p1[1], p2[0], p2[1], pz[0], pz[1]);
        }
      })
    })
  };

  clusters.forEach((c)=>{ draw_cluster(c,BLACK); });

  const k = (frameCount/10)%clusters.length;
  if(clusters[k]) draw_cluster(clusters[k],RED);
  
  // print HSM names on the diagram
  stroke(BLACK); fill(BLACK);
  const t_left = 400
  var t_top = 150 
  clusters.forEach((c,i)=>{
    text(c.name, t_left, t_top);
    t_top += 15;
    c.hsms.forEach((h,j)=>{
      text(h.name, t_left+5, t_top);
      t_top += 15;
    });
  });


  pop(); // restore draw state

  if( frameCount > 600 ){
    hsms.forEach(h=>console.log(h.name, h));
    zones.forEach(z=>console.log(z.name, z));
    servers.forEach(s=>console.log(s.name, s));
    clusters.forEach(c=>console.log(c.name, c));
    noLoop(); // stop after a number of iterations
  }
}

const loc = (a, x0, y0, r ) => {
  // x y coordinates of point on circle
  return [x0 + r * cos(a),y0 + r * sin(a)];
}

function draw_zone_ring(zones, x, y, radius) {
  strokeWeight(10); //thick
  zones.forEach((z,i)=>{
    const shade = i * 255 / zones.length
    c = color(shade,shade,0); // yellow
    z.draw(x,y,radius,c)
    z.servers.forEach((s,j)=>{
      const shade = (5*i+j) * 175 / zones.length
      c = color(21, 125, shade); 
      s.draw(x,y,radius-10,c)
    });
  });
  strokeWeight(1);
}

const server_colors = [RED, WHITE, RED, WHITE, RED, WHITE, RED, WHITE]
function draw_server_ring(servers, x, y, radius) {
  strokeWeight(10); //thick

  servers.forEach((s,i)=>{
    // 255
    const shade = i * 175 / zones.length
    c = color(21, 125, shade); 
    s.draw(x,y,radius,c)
  });
  strokeWeight(1);
}

const draw_arc = (x,y,radius,start,stop,color) =>{
  stroke(color); noFill();
  arc( x, y, radius, radius, start, stop);
}

TIME_COLUMN_INDEX = 0
ACTION_COLUMN_INDEX = 1
NAME_COLUMN_INDEX = 2

class Actions {
  // NOTE: action names must match the names in the csv file
  add_zone(table, index){
    // input: 10, add_zone, IAD6
    const args = parse_line(table, index)
    console.log("add zone: ", ...args)
    get_or_create(zones,new Zone(...args))
    // when we add a zone we have to recalculate the 
    // arcs to divide up the circle into equal segments
    var cursor = 0;
    var size = TWO_PI / zones.length;
    zones.forEach((z,i)=>{
      z.start = cursor;
      cursor += size;
      z.stop = cursor;
    });
  }
  add_server(table, index){
    // input: 50, add_server, 1.1.1.1, IAD6, blue
    const args = parse_line(table, index)
    console.log("add server: ", ...args);
    const zone = zones.find(x => x.name == args[1]);
    // TODO: if zone not found...
    const server = get_or_create(servers,new Server(...args))
    zone.servers.push(server)
    // when we add a server we have to recalculate the 
    // arcs to divide up the zone into equal segments
    var cursor = zone.start
    var size = (zone.stop-zone.start)/zone.servers.length;
    zone.servers.forEach((s,i)=>{
      console.log(s)
      s.start = cursor;
      cursor += size;
      s.stop = cursor;
    });
    console.log("server added. zones...", zones);
  }
  add_hsm(table, index){
    // 200, add_hsm, mary, 1.1.1.33, cluster1, blue
    const args = parse_line(table, index);
    const [hsm_name, server_name, cluster_name, hsm_color] = args;
    console.log("add hsm: ", hsm_name, "to", cluster_name, "on", server_name);
    const server = servers.find(x => x.name == server_name);
    if(server == undefined) console.error("server not found",server_name); 
    const cluster = get_or_create(clusters,new Cluster(cluster_name));
    const hsm = get_or_create(hsms,new Hsm(...args));
    cluster.add_hsm(hsm)
    server.add_hsm(hsm)

    // when we add a server we have to recalculate the 
    // positions to divide up the server arc into equal segments
    const segments = server.hsms.length + 1;
    const seg_len = (server.stop - server.start)/segments;
    var hsm_pos = server.start+seg_len; // first hsm
    server.hsms.forEach((h,i)=>{
      console.log("hsm", i, hsm_pos);
      h.position = hsm_pos;
      hsm_pos += seg_len;
    });
  }
  del_hsm(table, index){
    // 500, del_hsm, pat2
    const args = parse_line(table, index);
    const hsm_name = args[0];
    const i = hsms.findIndex(x => x.name == hsm_name);
    console.log("del hsm: ", hsm_name, i);
    clusters.forEach(s=>{delete s.hsms[hsm_name]});
    servers.forEach(s=>{delete s.hsms[hsm_name]});
    hsms.splice(i,1);
  } 
}
actions = new Actions();

const parse_line = (table, line_number) => {
  // 0 is time and 1 is action
  // these are NOT returned as results
  const results = [];
  var column_number = 2;
  try {
    while( true ){
        // table throws and error if no more columns in the table
        results.push(trim(table.getString(line_number,column_number)));
        column_number += 1;
    }
  }
  catch(err) {
    console.log(results)
  }
  return results;
}

const process_server_file = (timeCounter) => {
  // read all the unread rows for time less or equal now
  while( next_row_time(server_table) <= timeCounter ){
    server_row_index += 1
    const action = trim(server_table.getString(server_row_index,ACTION_COLUMN_INDEX));
    actions[action](server_table,server_row_index)
  }
}

const get_or_create = (xs,n) => {
  e = xs.find(x => n.name == x.name);
  if( e ) return e;
  xs.push(n);
  return n;
}

const next_row_time = (table) => {
  // all our tables have
  const data_row_count = server_table.getRowCount()-1; // less header
  if( server_row_index >= data_row_count ) return 9999999999; // max time
  // otherwise return the time on the next row to be read
  return trim(server_table.getString(server_row_index+1,TIME_COLUMN_INDEX));
}

const load_table = (filename) => {
  const table =  loadTable("assets/"+filename+".csv", "csv", function () {
      var row_count = table.getRowCount();
      var col_count = table.getColumnCount();
      console.log(filename, "table loaded", row_count, col_count);
  });
  return table
};
