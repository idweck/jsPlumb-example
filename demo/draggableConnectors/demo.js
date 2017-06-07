;
  exampleColor = "#00f";

(function () {

    var listDiv = document.getElementById("list"),

        showConnectionInfo = function (s) {
            listDiv.innerHTML = s;
            listDiv.style.display = "block";
        },
        hideConnectionInfo = function () {
            listDiv.style.display = "none";
        },
        connections = [],
        updateConnections = function (conn, remove) {
            if (!remove) connections.push(conn);
            else {
                var idx = -1;
                for (var i = 0; i < connections.length; i++) {
                    if (connections[i] == conn) {
                        idx = i;
                        break;
                    }
                }
                if (idx != -1) connections.splice(idx, 1);
            }
            if (connections.length > 0) {
                var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
                for (var j = 0; j < connections.length; j++) {
                    s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
                }
                showConnectionInfo(s);
            } else
                hideConnectionInfo();
        };

    jsPlumb.ready(function () {

        var instance = jsPlumb.getInstance({
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            PaintStyle: { stroke: '#666' },
            EndpointHoverStyle: { fill: "orange" },
            HoverPaintStyle: { stroke: "orange" },
            EndpointStyle: { width: 20, height: 16, stroke: '#666' },
            Endpoint: "Rectangle",
            Anchors: ["TopCenter", "TopCenter"],
            HoverPaintStyle: {stroke: exampleColor, strokeWidth: 10 },
            ConnectionOverlays: [
            [ "Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            } ],
                [ "Label",
                    { label: "FOO",
                    id: "label",
                    cssClass: "aLabel"
                    }
                ]
            ],
            Container: "canvas"
        });

        // suspend drawing and initialise.
        instance.batch(function () {

            // bind to connection/connectionDetached events, and update the list of connections on screen.
            instance.bind("connection", function (info, originalEvent) {
                updateConnections(info.connection);
                info.connection.getOverlay("label").setLabel("BAR");
            });
            instance.bind("connectionDetached", function (info, originalEvent) {
                updateConnections(info.connection, true);
            });

            instance.bind("connectionMoved", function (info, originalEvent) {
                //  only remove here, because a 'connection' event is also fired.
                // in a future release of jsplumb this extra connection event will not
                // be fired.
                updateConnections(info.connection, true);
            });

            instance.bind("click", function (component, originalEvent) {
                alert("click!")
            });

            // configure some drop options for use by all endpoints.
            var exampleDropOptions = {
                tolerance: "touch",
                hoverClass: "dropHover",
                activeClass: "dragActive"
            };

            //
            // first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
            // and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
            // starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
            // that declares 'exampleEndpoint' as its drop scope, and also that
            // only 'exampleConnection' types can be dropped here.
            //
            // the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a strokeWidth of
            // 5 pixels, and a gradient.
            //
            // there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
            // or not to allow a particular connection to be established.
            //
            var exampleEndpoint = {
                endpoint: "Rectangle",
                paintStyle: { width: 25, height: 21, fill: exampleColor },
                isSource: true,
                isTarget: false,
                reattach: false,
                scope: "blue",
                maxConnections: 10,
                connector:[ "Flowchart", {curviness: 75, midpoint:0.75, alwaysRespectStubs:true, stub: 50, cornerRadius: 100, gap: 10} ],
                






                //alwaysRespectStubs: true,
                connectorStyle: {
                    gradient: {stops: [
                        [0, exampleColor],
                        [0.5, "#09098e"],
                        [1, exampleColor]
                    ]},
                    strokeWidth: 5,
                    stroke: exampleColor
                    //dashstyle: "2 2"
                },
                //beforeDrop: function (params) {
                //    return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
                //},
                dropOptions: exampleDropOptions
            };

                        var exampleEndpointTarget = {
                endpoint: "Rectangle",
                paintStyle: { width: 25, height: 21, fill: exampleColor },
                isSource: false,
                isTarget: true,
                reattach: true,
                scope: "blue",
                maxConnections: 10,
                connectorStyle: {
                    gradient: {stops: [
                        [0, exampleColor],
                        [0.5, "#09098e"],
                        [1, exampleColor]
                    ]},
                    strokeWidth: 5,
                    stroke: exampleColor,
                    dashstyle: "2 2"
                },
                isTarget: true,
                //beforeDrop: function (params) {
                //    return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
                //},
                dropOptions: exampleDropOptions
            };

            //
            // the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
            // and has scope 'exampleConnection2'.
            //
            var color2 = "#316b31";
            var exampleEndpoint2 = {
                endpoint: ["Dot", { radius: 11 }],
                paintStyle: { fill: color2 },
                isSource: true,
                scope: "green",
                connectorStyle: { stroke: color2, strokeWidth: 6 },
                connector: ["Bezier", { curviness: 63 } ],
                maxConnections: 3,
                isTarget: true,
                dropOptions: exampleDropOptions
            };

            //
            // the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
            // 'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
            // overriden, so it appears in the same place on every element.
            //
            // this example also demonstrates the beforeDetach interceptor, which allows you to intercept
            // a connection detach and decide whether or not you wish to allow it to proceed.
            //
            var example3Color = "rgba(229,219,61,0.5)";
            var exampleEndpoint3 = {
                endpoint: ["Dot", {radius: 17} ],
                anchor: "BottomLeft",
                paintStyle: { fill: example3Color, opacity: 0.5 },
                isSource: true,
                scope: 'yellow',
                connectorStyle: {
                    stroke: example3Color,
                    strokeWidth: 4
                },
                connector: "Bezier",
                isTarget: true,
                dropOptions: exampleDropOptions,
                beforeDetach: function (conn) {
                    return confirm("Detach connection?");
                },
                onMaxConnections: function (info) {
                    alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
                }
            };

            // setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
            // of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)
            //var e1 = instance.addEndpoint('dragDropWindow1', { anchor: [0.5, 1, 0, 1] }, exampleEndpoint2);


                maxConnectionsCallback = function (info) {
                    alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
                };

            var e1 = instance.addEndpoint("dragDropWindow1", { anchor: "RightMiddle" }, exampleEndpoint);
            // you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
            e1.bind("maxConnections", maxConnectionsCallback);

            var e2 = instance.addEndpoint('dragDropWindow2', { anchor: "RightMiddle" }, exampleEndpoint);
            // again we bind manually. it's starting to get tedious.  but now that i've done one of the blue endpoints this way, i have to do them all...
            e2.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint('dragDropWindow2', { anchor: "RightMiddle" }, exampleEndpoint);

            var e3 = instance.addEndpoint("dragDropWindow3", { anchor: "RightMiddle" }, exampleEndpoint);
            e3.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow3", { anchor: "RightMiddle" }, exampleEndpoint);

            var e4 = instance.addEndpoint("dragDropWindow4", { anchor: "RightMiddle" }, exampleEndpoint);
            e4.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow4", { anchor: "RightMiddle" }, exampleEndpoint);

            var e5 = instance.addEndpoint("dragDropWindow5", { anchor: "RightMiddle" }, exampleEndpoint);
            e5.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow5", { anchor: "RightMiddle" }, exampleEndpointTarget);

            var e6 = instance.addEndpoint("dragDropWindow6", { anchor: "LeftMiddle" }, exampleEndpointTarget);
            e6.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow6", { anchor: "LeftMiddle" }, exampleEndpointTarget);

            var e7 = instance.addEndpoint("dragDropWindow7", { anchor: "LeftMiddle" }, exampleEndpointTarget);
            e7.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow7", { anchor: "LeftMiddle" }, exampleEndpointTarget);

            var e8 = instance.addEndpoint("dragDropWindow8", { anchor: "LeftMiddle" }, exampleEndpointTarget);
            e8.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow8", { anchor: "LeftMiddle" }, exampleEndpointTarget);

            var e9 = instance.addEndpoint("dragDropWindow9", { anchor: "LeftMiddle" }, exampleEndpointTarget);
            e9.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow9", { anchor: "LeftMiddle" }, exampleEndpointTarget);

            var e10 = instance.addEndpoint("dragDropWindow10", { anchor: "LeftMiddle" }, exampleEndpointTarget);
            e10.bind("maxConnections", maxConnectionsCallback);
            instance.addEndpoint("dragDropWindow10", { anchor: "LeftMiddle" }, exampleEndpointTarget);

            // make .window divs draggable
            instance.draggable(
                jsPlumb.getSelector(".drag-drop-demo .window"),
                {
                   containment:true,
                   drag: function() {
                    console.log("t");
                       var offset = $(this).offset();
                       var yPos = offset.top;
                       var xPos = offset.left;
                       console.log(yPos);
                       jsPlumb.repaint($(this), {left: xPos, top: 150});
                   }
               }
            );


            // add endpoint of type 3 using a selector.
            //instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint3);

            var hideLinks = jsPlumb.getSelector(".drag-drop-demo .hide");
            instance.on(hideLinks, "click", function (e) {
                instance.toggleVisible(this.getAttribute("rel"));
                jsPlumbUtil.consume(e);
            });

            var dragLinks = jsPlumb.getSelector(".drag-drop-demo .drag");
            instance.on(dragLinks, "click", function (e) {
                var s = instance.toggleDraggable(this.getAttribute("rel"));
                this.innerHTML = (s ? 'disable dragging' : 'disable dragging');
                jsPlumbUtil.consume(e);
            });

            var detachLinks = jsPlumb.getSelector(".drag-drop-demo .detach");
            instance.on(detachLinks, "click", function (e) {
                instance.detachAllConnections(this.getAttribute("rel"));
                jsPlumbUtil.consume(e);
            });

            instance.on(document.getElementById("clear"), "click", function (e) {
                instance.detachEveryConnection();
                showConnectionInfo("");
                jsPlumbUtil.consume(e);
            });
        });

        jsPlumb.fire("jsPlumbDemoLoaded", instance);

    });
})();