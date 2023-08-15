async function makeRequest(id) {
   // let response = await fetch(`http://207.180.192.253/api/Posts/${id}`);
   let response = await fetch(`http://localhost:3000/nodes`);

   if (response.ok) {
     let json = await response.json();
     console.log(json);
     return json;
   } else {
     console.error("Ошибка HTTP: " + response.status);
     return null;
   }
}

function getLocation(location) {
   switch (location) {
      case 0:
         return "down";
      case 1:
         return "left";
      case 2:
         return "right";
      case 3:
         return "top";
      default:
         return null;
   }
}

function getColor(postType) {
   switch (postType) {
      case 0:
         return "#A6A6A6";
      case 1:
         return "#3258F7";
      case 2:
         return "#FF66C4";
      default:
         return "#A6A6A6";
   }
}

//приклад коду для того щоб відобразити дерево 
// (async ()=>{
//    data = await makeRequest(1);
//    const ctorage = JSON.parse(localStorage.getItem("nodes"));
//    let nodes = [];

//    data.forEach((item) => {
//       let node = {};

//       node.id = item.id;
//       node.parentId = item.parentPostId;
//       node.location = getLocation(item.positiion);
//       node.title = item.title;
//       node.description = item.description;
//       node.postType = item.postType;

//       if (ctorage) {
//         const newNode = ctorage.find((elem) => elem.id === node.id);
//         if (!newNode) {
//           node.newNode = true;
//         }
//       }

//       nodes.push(node);
//    });

//    // console.log(nodes);
//    let index = 0;
//    let actNdCent = 0;
//    let compact = 0;

//    const newNode = nodes.filter(el => el.newNode == true);
//    // console.log(newNode);
//    nodes = nodes.filter(el => el?.newNode != true);

//    const chart = new d3.OrgChart()
//    .container(".chart-container")
//    .data(nodes)
//    .nodeHeight((d) => 150)
//    .nodeWidth((d) => { return 200;})
//    .childrenMargin((d) => 50)
//    .compactMarginBetween((d) => 50)
//    .compactMarginPair((d) => 100)
//    .siblingsMargin((d) => 25)
//    .buttonContent(({ node, state }) => {
//      return `<div style="px;color:#716E7B;border-radius:5px;padding:4px;font-size:10px;margin:auto auto;background-color:white;border: 1px solid #E4E2E9"> <span style="font-size:9px">${
//        node.children
//          ? `<i class="fas fa-angle-up"></i>`
//          : `<i class="fas fa-angle-down"></i>`
//      }</span> ${node.data._directSubordinates}  </div>`;
//    })
//    .linkUpdate(function (d, i, arr) {
//      d3.select(this)
//        .attr("stroke", (d) =>
//          d.data._upToTheRootHighlighted ? "#14760D" : "#2CAAE5"
//        )
//        .attr("stroke-width", (d) =>
//          d.data._upToTheRootHighlighted ? 15 : 1
//        );

//      if (d.data._upToTheRootHighlighted) {
//        d3.select(this).raise();
//      }
//    })
//    .nodeContent(function (d, i, arr, state) {

//      return `
//          <div class="card" style="background:${getColor(d.data.postType)};">
//             <div class="card__body">
//                <div class="card__title">
//                      ${d.data.title}
//                </div>
//                <div class="card__content">
//                      ${d.data.description}
//                </div>
//             </div>
//          </div>
//       `;
//    })
//    .render();

//    chart.expandAll();
//    chart.compact(!!(compact++ % 2)).render().fit();
//    // chart.setExpanded("2", false).render();

//    // nodes.forEach(item => {
//    //    if(item.newNode){
//    //       chart.setExpanded(item.id, false).render();
//    //       item.newNode = false;
//    //    }
//    // })



//    document.querySelector('#swap').addEventListener('click', function() {
//       chart.layout(["right","bottom","left","top"][index++%4]).render().fit();
//    });

//    document.querySelector('#zoom-out').addEventListener('click', function() {
//       chart.zoomOut(); // -
//    });

//    document.querySelector('#zoom-in').addEventListener('click', function() {
//       chart.zoomIn(); // +
//    });

//    document.querySelector('#fullscreen').addEventListener('click', function() {
//       chart.fullscreen('body');
//    });

//    document.querySelector('#show').addEventListener('click', function() {
//       nodes = [...nodes, ...newNode];
//       chart.data(nodes).render();
//       chart.expandAll();

//        nodes.forEach(item => {
//          if(item.newNode){
//             item.newNode = false;
//          }
//       });
//       localStorage.setItem("nodes", JSON.stringify(nodes));
//    });

   
//    localStorage.setItem("nodes", JSON.stringify(nodes));
   
//    //chart.setHighlighted("1").render() //id mark
//    //chart.setUpToTheRootHighlighted("1").render().fit() //id mark root
//    //chart.clearHighlighting(); clear mark
// })();


function onTelegramAuth(user) {

   const headers = {
      'Content-Type': 'application/json'
   };
    
   //Запит для перевірки користувача 
   fetch(`http://207.180.192.253/api/Posts/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Помилка:', error);
    });


   //цей код потрібно виконати після авторизації 
   if (user.id) {
      console.log("Telegram user data",user);
      const body = document.querySelector("body");
      body.innerHTML = `
         <main class="main">
            <div class="chart-container"></div>
         </main>
      `;

      (async ()=>{

         data = await makeRequest(1); //сюди вставляємо user.id замість цифри заглушки 1
         const ctorage = JSON.parse(localStorage.getItem("nodes"));
         let nodes = [];
      
         data.forEach((item) => {
            let node = {};
      
            node.id = item.id;
            node.parentId = item.parentPostId;
            node.location = getLocation(item.positiion);
            node.title = item.title;
            node.description = item.description;
            node.postType = item.postType;
      
            if (ctorage) {
              const newNode = ctorage.find((elem) => elem.id === node.id);
              if (!newNode) {
                node.newNode = true;
              }
            }
      
            nodes.push(node);
         });
      
         // console.log(nodes);
         let index = 0;
         let actNdCent = 0;
         let compact = 0;
      
         const newNode = nodes.filter(el => el.newNode == true);
         // console.log(newNode);
         nodes = nodes.filter(el => el?.newNode != true);
      
         const chart = new d3.OrgChart()
         .container(".chart-container")
         .data(nodes)
         .nodeHeight((d) => 150)
         .nodeWidth((d) => { return 200;})
         .childrenMargin((d) => 50)
         .compactMarginBetween((d) => 50)
         .compactMarginPair((d) => 100)
         .siblingsMargin((d) => 25)
         .buttonContent(({ node, state }) => {
           return `<div style="px;color:#716E7B;border-radius:5px;padding:4px;font-size:10px;margin:auto auto;background-color:white;border: 1px solid #E4E2E9"> <span style="font-size:9px">${
             node.children
               ? `<i class="fas fa-angle-up"></i>`
               : `<i class="fas fa-angle-down"></i>`
           }</span> ${node.data._directSubordinates}  </div>`;
         })
         .linkUpdate(function (d, i, arr) {
           d3.select(this)
             .attr("stroke", (d) =>
               d.data._upToTheRootHighlighted ? "#14760D" : "#2CAAE5"
             )
             .attr("stroke-width", (d) =>
               d.data._upToTheRootHighlighted ? 15 : 1
             );
      
           if (d.data._upToTheRootHighlighted) {
             d3.select(this).raise();
           }
         })
         .nodeContent(function (d, i, arr, state) {
      
           return `
               <div class="card" style="background:${getColor(d.data.postType)};">
                  <div class="card__body">
                     <div class="card__title">
                        <a href="#">
                           ${d.data.title}
                        </a>
                     </div>
                     <div class="card__content">
                           ${d.data.description}
                     </div>
                  </div>
               </div>
            `;
         })
         .render();
      
         chart.expandAll();
         chart.compact(!!(compact++ % 2)).render().fit();
         // chart.setExpanded("2", false).render();
      
         // nodes.forEach(item => {
         //    if(item.newNode){
         //       chart.setExpanded(item.id, false).render();
         //       item.newNode = false;
         //    }
         // })
      
      
      
         document.querySelector('#swap').addEventListener('click', function() {
            chart.layout(["right","bottom","left","top"][index++%4]).render().fit();
         });
      
         document.querySelector('#zoom-out').addEventListener('click', function() {
            chart.zoomOut(); // -
         });
      
         document.querySelector('#zoom-in').addEventListener('click', function() {
            chart.zoomIn(); // +
         });
      
         document.querySelector('#fullscreen').addEventListener('click', function() {
            chart.fullscreen('body');
         });
      
         document.querySelector('#show').addEventListener('click', function() {
            nodes = [...nodes, ...newNode];
            chart.data(nodes).render();
            chart.expandAll();
      
             nodes.forEach(item => {
               if(item.newNode){
                  item.newNode = false;
               }
            });
            localStorage.setItem("nodes", JSON.stringify(nodes));
         });
      
         
         localStorage.setItem("nodes", JSON.stringify(nodes));
         
         //chart.setHighlighted("1").render() //id mark
         //chart.setUpToTheRootHighlighted("1").render().fit() //id mark root
         //chart.clearHighlighting(); clear mark
      })();

   }
}