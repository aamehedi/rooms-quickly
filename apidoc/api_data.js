define({ "api": [
  {
    "type": "get",
    "url": "/bids/:id",
    "title": "Show information of a bid.",
    "name": "GetBid",
    "group": "Bid",
    "description": "<p>Show information of a bid.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET \\\n  http://localhost:5000/bids/593e8cb99190921504b8d4e4 \\\n  -H 'cache-control: no-cache' \\\n  -H 'content-type: application/json' \\",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Indicates whetther the request is a success or fail.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "bid",
            "description": "<p>Information of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid._id",
            "description": "<p>Id of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "bid.amount",
            "description": "<p>Amount of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid.roomId",
            "description": "<p>The id of the room of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid.partnerId",
            "description": "<p>The id of the partner of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "bid.winner",
            "description": "<p>Indicates if the bid is a winner.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"success\": true,\n    \"bid\": {\n        \"_id\": \"593e8cb99190921504b8d4e4\",\n        \"partnerId\": \"593c4f008a942f021199fb72\",\n        \"amount\": 350,\n        \"roomId\": \"593c4f008a942f021199fb5e\",\n        \"__v\": 0,\n        \"winner\": false\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Indicates whetther the request is a success or fail.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>The message from the error response.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"success\": false,\n    \"msg\": \"No bid have been found with the specified id.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/router.ts",
    "groupTitle": "Bid"
  },
  {
    "type": "get",
    "url": "/rooms/:id/bids/:skip?/:limit?",
    "title": "Get list of active bids for a specific room.",
    "name": "GetBids",
    "group": "Room",
    "description": "<p>Get list of active bids for a specific room.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET \\\n  http://localhost:5000/rooms/593c4f008a942f021199fb5e/bids/1/2 \\\n  -H 'cache-control: no-cache' \\\n  -H 'content-type: application/json' \\",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Indicates whetther the request is a success or fail.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "bids",
            "description": "<p>List of active bids.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid._id",
            "description": "<p>Id of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "bid.amount",
            "description": "<p>Amount of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid.partnerId",
            "description": "<p>The id of the partner of the bid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"success\": true,\n    \"bids\": [\n        {\n            \"_id\": \"594018710824d765a34152e6\",\n            \"amount\": 600,\n            \"partnerId\": \"593c4f008a942f021199fb6f\"\n        },\n        {\n            \"_id\": \"594012080c49992acad14477\",\n            \"amount\": 480,\n            \"partnerId\": \"593c4f008a942f021199fb72\"\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Indicates whetther the request is a success or fail.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>The message from the error response.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"success\": false,\n    \"msg\": \"Some error have been occured in the server\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/router.ts",
    "groupTitle": "Room"
  },
  {
    "type": "get",
    "url": "/rooms",
    "title": "Get list of active auction rooms with pagination support.",
    "name": "GetRooms",
    "group": "Room",
    "description": "<p>Get list of active auction rooms with pagination support.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X GET \\\n  http://localhost:5000/rooms \\\n  -H 'cache-control: no-cache' \\\n  -H 'content-type: application/json' \\",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rooms",
            "description": "<p>List of active auction rooms.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms._id",
            "description": "<p>Id of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.name",
            "description": "<p>Name of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.description",
            "description": "<p>Description of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "rooms.endTime",
            "description": "<p>Auction end time for this room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rooms.minimalBid",
            "description": "<p>Minimal allowed bid of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rooms.hotel",
            "description": "<p>Hotel information of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.name",
            "description": "<p>Name of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.phone",
            "description": "<p>Phone number of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.email",
            "description": "<p>Email number of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rooms.hotel.address",
            "description": "<p>Address information of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.address.streetAddress",
            "description": "<p>Street address of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.address.zipCode",
            "description": "<p>Zip code of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.address.city",
            "description": "<p>City of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.address.state",
            "description": "<p>State of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.hotel.address.country",
            "description": "<p>Country of the hotel.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "rooms.winnerBid",
            "description": "<p>Winner bid information of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.winnerBid._id",
            "description": "<p>Id of the winner bid of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rooms.winnerBid.amount",
            "description": "<p>Amount of the winner bid of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.winnerBid.parnerId",
            "description": "<p>Partner ID of the winner bid of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rooms.activeBids",
            "description": "<p>Active bids information of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.activeBids._id",
            "description": "<p>Active bid id of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rooms.activeBids.amount",
            "description": "<p>Amount of the active bid id of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rooms.activeBids.partnerId",
            "description": "<p>Partner ID of the active bid id of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "rooms.specialities",
            "description": "<p>Specialities of the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rooms.children",
            "description": "<p>Maximum number of children can accomodate in the room.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rooms.adults",
            "description": "<p>Maximum number of adults can accomodate in the room.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    {\n        \"_id\": \"593c4f008a942f021199fb5e\",\n        \"name\": \"Schinner - Ziemann\",\n        \"description\": \"Et eum consectetur nihil ab. Corrupti nihil neque qui provident maiores doloribus.\n             At consequatur ratione et molestias deserunt mollitia molestiae quae dolor. Pariatur dicta\n             consequatur. Explicabo qui doloremque quia ut.\\n \\rQui autem ex neque laborum asperiores placeat.\n             Ea expedita officia explicabo blanditiis architecto ducimus. Tenetur ut non sit facilis excepturi\n             dolorum. Animi necessitatibus sed debitis repudiandae. Rem rerum accusantium consequatur quaerat\n             quae est omnis reiciendis.\\n \\rEt beatae distinctio. Qui eum et quisquam. Enim eos non minima\n             ratione. Optio ipsum sint impedit voluptatem aliquid fugiat. Ut laudantium eos.\",\n        \"endTime\": \"2017-06-13T15:49:03.969Z\",\n        \"minimalBid\": 91,\n        \"hotel\": {\n            \"name\": \"Anderson Inc\",\n            \"phone\": \"975.736.5685 x7816\",\n            \"email\": \"Desmond_Steuber@yahoo.com\",\n            \"_id\": \"593c4f008a942f021199fb5f\",\n            \"address\": {\n                \"streetAddress\": \"787 Gusikowski Ranch\",\n                \"zipCode\": \"45568-7106\",\n                \"city\": \"New Stephaniachester\",\n                \"state\": \"North Carolina\",\n                \"country\": \"Morocco\"\n            }\n        },\n        \"__v\": 27,\n        \"winnerBid\": {\n            \"amount\": 450,\n            \"partnerId\": \"593c4f008a942f021199fb72\",\n            \"_id\": \"593ec7d46533501b04d388da\"\n        },\n        \"activeBids\": [\n            {\n                \"_id\": \"593ec7d46533501b04d388da\",\n                \"amount\": 450,\n                \"partnerId\": \"593c4f008a942f021199fb72\"\n            }\n        ],\n        \"specialities\": [\n            \"et\",\n            \"quia\",\n            \"commodi\",\n            \"amet\",\n            \"voluptatem\",\n            \"earum\",\n            \"perspiciatis\"\n        ],\n        \"children\": 10,\n        \"adults\": 8\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/router.ts",
    "groupTitle": "Room"
  },
  {
    "type": "post",
    "url": "/rooms/:id/bid",
    "title": "Post a bid to a specific room.",
    "name": "PostBid",
    "group": "Room",
    "description": "<p>Post a bid to a specific room.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST \\\n  http://localhost:5000/rooms/593c4f008a942f021199fb5e/bid \\\n  -H 'cache-control: no-cache' \\\n  -H 'content-type: application/json' \\\n  -d '{\n  \"bid\": {\n    \"partnerId\": \"593c4f008a942f021199fb72\",\n    \"amount\": 480\n  }\n}'",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Indicates whetther posting the bid is a success or fail.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "bid",
            "description": "<p>The bid information that have been posted.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid._id",
            "description": "<p>Id of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "bid.amount",
            "description": "<p>Amount of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid.roomId",
            "description": "<p>The id of the room of the bid.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid.partnerId",
            "description": "<p>The id of the partner of the bid.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"success\": true,\n    \"bid\": {\n        \"partnerId\": \"593c4f008a942f021199fb72\",\n        \"amount\": 480,\n        \"_id\": \"594012080c49992acad14477\",\n        \"roomId\": \"593c4f008a942f021199fb5e\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Indicates whetther posting the bid is a success or fail.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "msg",
            "description": "<p>The message information from the error response.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Objecet",
            "optional": false,
            "field": "msg.errors",
            "description": "<p>Errors that occured.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "msg.errors.winnerBid",
            "description": "<p>The error message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"success\": false,\n    \"msg\": {\n        \"errors\": {\n            \"winnerBid\": \"Bidding for this room is expired now. Cannot take any more bids.\"\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/router.ts",
    "groupTitle": "Room"
  }
] });
