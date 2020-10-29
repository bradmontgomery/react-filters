function Select(props) {
  const value = props.value ? props.value : "";
  const options = props.options.map((value) =>
    <option key={value} value={value}>{value}</option>
  );
  return (
      <div class="control">
        <div class="select">
            <select id={props.id} onChange={props.onChange} value={value}>
            {options}
          </select>
        </div>
      </div>
  );
}


class App extends React.Component {

  // TODO:
  // 1. pass in some initial values for year/make/model (pre-selected values?)
  // 2. pass in values for Options? or fetch from an api in componentDidMount
  constructor(props) {
    super(props);
    this.state = this.setInitialState();
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMakeChange = this.handleMakeChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);

    this.options = {
        year: ["", 2020, 2019, 2018],
        make: ["", "Honda", "Ford", "Cannondale"],
        model: ["", "T", "X", "CX", "ASDF"],
    }
  }

  setInitialState() {
    // Set a default initial state, but fill in values from the queryString
    // if they're set.
    const params = new URLSearchParams(location.search);
    let newState = { year: "", make: "", model: ""}
    params.forEach((value, key) => {
        if(value && (key === "make" || key === "model")) {
            newState[key] = value;
        } else if(value && key == "year") {
            newState[key] = parseInt(value);
        }
    });
    console.log("New State: ", newState);
    return newState
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // This is the proper place to to async requests?
    // https://reactjs.org/docs/react-component.html#componentdidupdate

    let url = new URL(window.location)
    let params = new URLSearchParams(url.search);

    if(this.state.year) {
        params.set('year', this.state.year);
    }
    if(this.state.make) {
        params.set('make', this.state.make);
    }
    if(this.state.model) {
        params.set('model', this.state.model);
    }
    const querystring = params.toString();
    window.location.search = querystring;
  }

  handleYearChange(e) {
    const year = parseInt(e.target.value);
    this.setState({ year: year });
  }

  handleMakeChange(e) {
    const make = e.target.value;
    this.setState({ make: make });
  }

  handleModelChange(e) {
    const model = e.target.value;
    this.setState({ model: model });
  }

  render() {
    return (
      <div class="field is-grouped">
        <Select id="year"
            onChange={this.handleYearChange}
            options={this.options.year}
            value={this.state.year} />
        <Select id="make"
            onChange={this.handleMakeChange}
            options={this.options.make}
            value={this.state.make} />
        <Select id="model"
            onChange={this.handleModelChange}
            options={this.options.model}
            value={this.state.model} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

