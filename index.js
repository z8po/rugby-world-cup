window.onload = function() {
  d3.csv('match.csv',
    function(err, cup) {
      console.log(cup);
      var isFailing = /iPad|iPhone|iPod/.test(navigator.platform);

      // pool table generator
      d3.csv('pool.csv', function(err, pools) {
        function makeTable(idPool) {
          var tablePool = document.createElement('table');
          tablePool.setAttribute('class', 'table table-hover');
          //set ID by table
          tablePool.setAttribute('id', 'pool' + idPool);
          //create thead & insert title
          var tHead = tablePool.appendChild(document.createElement('thead'));
          var tHeadRow = tHead.insertRow(0);
          var tHeadCell = tHead.children[0].appendChild(document.createElement("th"));
          tHeadCell.textContent = 'Poule ' + idPool;
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
          return tablePool;
        }
        var qualif = document.getElementById('qualification');
        qualif.appendChild(makeTable('A'));
        qualif.appendChild(makeTable('B'));
        qualif.appendChild(makeTable('C'));
        qualif.appendChild(makeTable('D'));

        pools.forEach(function(team) {
          var tableTarget = document.getElementById('pool' + team.pool);

          var tBody = tableTarget.getElementsByTagName('tbody');
          //insert row
          var tBodyRow = tBody[0].insertRow(0);
          //insert data
          var country = tBodyRow.insertCell(0);

          var countryLowerCase = team.country.toLowerCase().replace(/ /g, "-").replace(/é/g, "e");

          var flagCountry = country.appendChild(document.createElement('span'));
          flagCountry.setAttribute('class', 'tLogoSmall FJI ' + countryLowerCase);

          var nameCountry = country.appendChild(document.createElement('span'));
          nameCountry.textContent = team.country;
          //flagCountry.textContent = team.country;
          function cleanEmpty(value) {
            value = value === '' ? 0 : value;
            return value;
          }
          var P = tBodyRow.insertCell(1);
          P.textContent = cleanEmpty(team.P);
          var W = tBodyRow.insertCell(2);
          W.textContent = cleanEmpty(team.W);
          var D = tBodyRow.insertCell(3);
          D.textContent = cleanEmpty(team.D);
          var L = tBodyRow.insertCell(4);
          L.textContent = cleanEmpty(team.L);
          var PF = tBodyRow.insertCell(5);
          PF.textContent = cleanEmpty(team.PF);
          var PA = tBodyRow.insertCell(6);
          PA.textContent = cleanEmpty(team.PA);
          var PD = tBodyRow.insertCell(7);
          PD.textContent = cleanEmpty(team.PD);
          var TF = tBodyRow.insertCell(8);
          TF.textContent = cleanEmpty(team.TF);
          var TA = tBodyRow.insertCell(9);
          TA.textContent = cleanEmpty(team.TA);
          var BP = tBodyRow.insertCell(10);
          BP.textContent = cleanEmpty(team.BP);
          var PTS = tBodyRow.insertCell(11);
          PTS.textContent = cleanEmpty(team.PTS);
        });
      });


      // csv to tree
      var nodesByName = {};

      function nodeByName(obj, type) {
        return nodesByName[obj[type]] || (nodesByName[obj[type]] = {
          name: obj.name,
          target: obj.target,
          source: obj.source,
          date: obj.date,
          hour: obj.hour,
          stadium: obj.stadium,
          countryFirst: obj.countryFirst,
          countrySecond: obj.countrySecond,
          score: obj.score

        });
      }
      var memoCup = cup;
      var memoTitle = ['name', 'countryFirst', 'countrySecond', 'date', 'hour', 'score', 'stadium'];

      var fallBackPrintArray = function(data, columns) {
        console.log(cup);
        var table = d3.select('.container').append('table');
        table.attr('class', 'table table-hover');
        var thead = table.append('thead');
        thead.append('tr')
          .append('th')
          .text("Tout les matches").attr('colspan', 7);

        var tbody = table.append('tbody');
        var rows = tbody.selectAll('tr')
          .data(cup)
          .enter()
          .append('tr');
        var cells = rows.selectAll('td')
          .data(function(row) {
            return columns.map(function(column) {
              return {
                column: column,
                value: row[column]
              };
            });
          })
          .enter()
          .append('td')
          .attr('class', function(d) {
            if (d.column === 'countryFirst'  ) {
              return 'tLogoSmall tLogoSmall-left ' + d.value.toLowerCase().replace(/ /g, '-')
              .replace(/é/g, 'e');
            } else if (d.column === 'countrySecond') {
              return 'tLogoSmall tLogoSmall-right '  + d.value.toLowerCase().replace(/ /g, '-')
              .replace(/é/g, 'e');
            }
          })
          .text(function(d, i) {
            console.log(d);
              return d.value;
          });
      };

      memoCup.forEach(function(link, index) {
        var parent = link.source = nodeByName(link, 'source'),
          child = link.target = nodeByName(link, 'target');
        if (parent.children) {
          parent.children.push(child);
        } else {
          parent.children = [child];
        }
      });
      memoCup = nodesByName;
      var init = function(cup) {
        var insertLinebreaks = function(d) {
          var el = d3.select(this);
          var words = d.split(' ');
          el.text('');

          for (var i = 0; i < words.length; i++) {
            var tspan = el.append('tspan').text(words[i]);
            if (i > 0)
              tspan.attr('x', 0).attr('dy', '15');
          }
        };
        var margin = {
            top: 100,
            right: 100,
            bottom: 100,
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

        var tree = d3.layout.tree()
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
        var nodes = tree.nodes(cup.finale),
          links = tree.links(nodes);

        /* link factory */
        var link = svg.selectAll(".link")
          .data(links)
          .enter().append("path")
          .attr("class", function(d) {
            return 'link';
          })
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
            return 5;
          })
          .attr("dy", 60)
          .text(function(d) {
            if (d.countryFirst && d.countrySecond) {
              return d.countryFirst + " - " + d.countrySecond;
            }
          });

        node.append("text")
          .attr("dx", function(d) {
            return 5;
          })
          .attr("dy", 60)
          .text(function(d) {
            return d.name;
          });

        node.append("text")
          .attr("dx", function(d) {
            return 5;
          })
          .attr('class', 'stadium')
          .attr("dy", 75)
          .text(function(d) {
            if (d.date && d.hour) {
              return d.date + ' ' + d.hour;
            }
          });

        node.append("text")
          .attr("dx", function(d) {
            return 5;
          })
          .attr('class', 'stadium')
          .attr("dy", 90)
          .text(function(d) {
            return d.stadium.split(',').join(',');
          });

      };
      if (isFailing) {
        // memoCup
        fallBackPrintArray(cup, memoTitle);
      } else {
        init(memoCup);
        fallBackPrintArray(cup, memoTitle);
      }

      window.onresize = function() {
        if (!isFailing) {
          document.getElementById("centralsvg").remove(0);
          init(memoCup);
        }
      };
    });
};
