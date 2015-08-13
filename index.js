window.onload = function() {
  d3.json('/match.json',
    function(err, cup) {
      cup.children.forEach(function(half) {
        half.children.forEach(function(pool) {
            console.log(pool);
            if (pool.stats && pool.stats.length !== 0) {
              //generating the table layout
              var tablePool = document.createElement('table');
              tablePool.setAttribute('class', 'table table-hover');
              //set ID by table
              var poolName = pool.name.replace(/ +/g, "");
              tablePool.setAttribute('id', poolName);
              //create thead & insert title
              var tHead = tablePool.appendChild(document.createElement('thead'));
              var tHeadRow = tHead.insertRow(0);
              var tHeadCell = tHead.children[0].appendChild(document.createElement("th"));
              tHeadCell.textContent = 'Poule ' + pool.pool;
              tHeadCell.setAttribute('class', 'poolTable');
              var Played = tHead.children[0].appendChild(document.createElement("th"));
              Played.textContent = 'Played';
              var Win = tHead.children[0].appendChild(document.createElement("th"));
              Win.textContent = 'Win';
              var Draw = tHead.children[0].appendChild(document.createElement("th"));
              Draw.textContent = 'Draw';
              var Lost = tHead.children[0].appendChild(document.createElement("th"));
              Lost.textContent = 'Lost';
              var PointsFor = tHead.children[0].appendChild(document.createElement("th"));
              PointsFor.textContent = 'Points For';
              var PointsAgainst = tHead.children[0].appendChild(document.createElement("th"));
              PointsAgainst.textContent = 'Points Against';
              var PointsDifference = tHead.children[0].appendChild(document.createElement("th"));
              PointsDifference.textContent = 'Points Difference';
              var TriesFor = tHead.children[0].appendChild(document.createElement("th"));
              TriesFor.textContent = 'Tries For';
              var TriesAgainst = tHead.children[0].appendChild(document.createElement("th"));
              TriesAgainst.textContent = 'Tries Against';
              var BonusPoints = tHead.children[0].appendChild(document.createElement("th"));
              BonusPoints.textContent = 'Bonus Points';
              var Points = tHead.children[0].appendChild(document.createElement("th"));
              Points.textContent = 'Points';
              //create tbody
              var tBody = tablePool.appendChild(document.createElement('tbody'));
              pool.stats.forEach(function(team) {
                //insert row
                var tBodyRow = tBody.insertRow(0);
                //insert data
                var country = tBodyRow.insertCell(0);

                var countryLowerCase = team.country.toLowerCase().replace(/ /g, "-").replace(/é/g, "e");
                var flagCountry = country.appendChild(document.createElement('span'));
                flagCountry.setAttribute('class', 'tLogoSmall FJI ' + countryLowerCase);
                var nameCountry = country.appendChild(document.createElement('span'));
                nameCountry.textContent = team.country;
                //flagCountry.textContent = team.country;
                var P = tBodyRow.insertCell(1);
                P.textContent = team.P;
                var W = tBodyRow.insertCell(2);
                W.textContent = team.W;
                var D = tBodyRow.insertCell(3);
                D.textContent = team.D;
                var L = tBodyRow.insertCell(4);
                L.textContent = team.L;
                var PF = tBodyRow.insertCell(5);
                PF.textContent = team.PF;
                var PA = tBodyRow.insertCell(6);
                PA.textContent = team.PA;
                var PD = tBodyRow.insertCell(7);
                PD.textContent = team.PD;
                var TF = tBodyRow.insertCell(8);
                TF.textContent = team.TF;
                var TA = tBodyRow.insertCell(9);
                TA.textContent = team.TA;
                var BP = tBodyRow.insertCell(10);
                BP.textContent = team.BP;
                var PTS = tBodyRow.insertCell(11);
                PTS.textContent = team.PTS;
              });
              //initiate
              var qualif = document.getElementById('qualification');
              qualif.appendChild(tablePool);
            }
        });
      });

      function startTimer(duration, display) {
        var timer = duration,
          minutes, seconds;
        setInterval(function() {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (--timer < 0) {
            timer = duration;
          }
        }, 1000);
      }

      var init = function (cup) {

        var margin = {
            top: 100,
            right: 25,
            bottom: 20,
            left: 25
          },
          width = document.getElementById('tournament').clientWidth - margin.right - margin.left,
          height = 2000 - margin.top - margin.bottom;

        var orientations = {
          "topToBottom": {
            size: [width, height],
            x: function(d) {
              return d.x;
            },
            y: function(d) {
              return d.y;
            },
            cx: function(d) {
              return d.cx;
            },
            cy: function(d) {
              return height - d.cy;
            }
          },
          "rightToLeft": {
            size: [height, width],
            x: function(d) {
              return width - d.y;
            },
            y: function(d) {
              return d.x;
            }
          },
          "bottomToTop": {
            size: [width, height],
            x: function(d) {
              return d.x;
            },
            // equalize  with circle radius
            y: function(d) {
              return height - d.y;
            },
            cx: function(d) {
              return d.cx;
            },
            cy: function(d) {
              return height - d.cy;
            }
          },
          "leftToRight": {
            size: [height, width],
            x: function(d) {
              return d.y;
            },
            y: function(d) {
              return d.x;
            }
          }
        };

        var cluster = d3.layout.cluster()
          // here are invert width and height
          .size(orientations.bottomToTop.size);

        /* vertical */
        var diagonal = d3.svg.diagonal()
          // Flip the values here.
          .projection(function(d) {
            return [orientations.bottomToTop.x(d), orientations.bottomToTop.y(d)];
          });

        var svg = d3.select("#championship")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr('id', 'centralsvg')
          .attr("transform", "translate( " + margin.left + ", " + margin.top + ")");

        /* nodes & links */
        var nodes = cluster.nodes(cup),
          links = cluster.links(nodes);

        /* link factory */
        var link = svg.selectAll(".link")
          .data(links)
          .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

        /* node factory */
        var node = svg.selectAll(".node")
          .data(nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + orientations.bottomToTop.x(d) + "," + orientations.bottomToTop.y(d) + ") ";
          });

        // node as circle

        var i = 0;

        node.append("circle")
          .attr("r", 40)

        .attr("class", "bubble")
          .style("fill", "transparent");

        node.append("circle")
          .attr("r", 17.5)
          .attr("class", "shield")
          .attr("cx", function(d) {
            return -20;
          })
          .style("fill", function(d) {
            var avatar = "";
            if (d.countryFirst) {
              avatar = d.countryFirst
                        .toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/é/g, 'e');
              avatar = "url(#" + avatar + ")";
            } else {
              avatar = "url(#image)";
            }
            return avatar;
          });

        node.append("circle")
          .attr("r", 17.5)
          .attr("class", "shield")
          .attr("cx", function(d) {
            return +20;
          })
          //.style("fill", "url(#image)");
          .style("fill", function(d) {
            var avatar = "";
            if (d.countrySecond) {
              avatar = d.countrySecond
                        .toLowerCase()
                        .replace(/ /g, '-')
                        .replace(/é/g, 'e');
              avatar = "url(#" + avatar + ")";
            } else {
              avatar = "url(#image)";
            }
            return avatar;
          });

        node.append("text")
          .attr("dx", function(d) {
            return 48;
          })
          .attr("dy", 0)
          // .style("text-anchor", function(d) { return d.children ? "start" : "start"; })
          .text(function(d) {
            if (d.countryFirst && d.countrySecond) {
              return d.countryFirst + " Vs " + d.countrySecond;
            }
          });

        node.append("text")
          .attr("dx", function(d) {
            return 48;
          })
          .attr("dy", 0)
          // .style("text-anchor", function(d) { return d.children ? "start" : "start"; })
          .text(function(d) {
            return d.name;
          });

        node.append("text")
          .attr("dx", function(d) {
            return 48;
          })
          .attr('class', 'stadium')
          .attr("dy", 15)
          // .style("text-anchor", function(d) { return d.children ? "start" : "start"; })
          .text(function(d) {
            if (d.date && d.hour) {
              return d.date + ' ' + d.hour;
            }
          });

        node.append("text")
          .attr("dx", function(d) {
            return 48;
          })
          .attr('class', 'stadium')
          .attr("dy", 30)
          // .style("text-anchor", function(d) { return d.children ? "start" : "start"; })
          .text(function(d) {
            return d.stadium;
          });

      };

    init(cup);
    window.onresize = function() {
      document.getElementById("centralsvg").remove(0);
      init(cup);
    };
    });
};
