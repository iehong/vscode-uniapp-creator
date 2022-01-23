Component({
  options: {
    virtualHost: true,
    styleIsolation: "isolated",
  },
  properties: {
    innerText: {
      type: String,
      value: "default value",
    },
  },
  data: {
    someData: {},
  },
  methods: {
    customMethod: function () {},
  },
});
