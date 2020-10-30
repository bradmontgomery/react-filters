function Select(props) {
  const value = props.value ? props.value : "";
  const options = props.options.map((value) =>
    <option key={value} value={value}>{value}</option>
  );
  return (
      <div className="control">
        <div className="select">
            <select id={props.id} onChange={props.onChange} value={value}>
            {options}
          </select>
        </div>
      </div>
  );
}

// TODO: want a multi-select element that works kinda like select2 or chosenjs.
// Working: INput element (search) + visible matching drop-down options.
// TODO: We need some way to register & display the selected values.
// TODO: need some way to set default selected values on creation.
class MultiSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: props.size ? props.size : 5,
            options: props.options ? props.options : [],
            values: props.values ? props.values : [], // selected values
            search: "",
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const val = e.target.value;
        this.setState({search: val});
    }

    render() {
        const visibleOptions = this.state.options.map((opt) => {
            if(this.state.search && opt.startsWith(this.state.search)) {  // .startsWith not in all browsers.
                return <a href="#" key={opt} className="dropdown-item">{opt}</a>
            }
        });
        const isActive = visibleOptions.length > 0;

        return (
            <div className="control">
                <div className={"dropdown" + (isActive ? " is-active" : "")}>
                  <div className="dropdown-trigger">
                    <div className="control" aria-haspopup="true" aria-controls="dropdown-menu">
                        <input className="input"
                               type="text"
                               placeholder="Search"
                               onChange={this.handleChange} />
                    </div>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {isActive && visibleOptions}
                    </div>
                  </div>
                </div>
            </div>
        );
    }
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
        tags: ["", "bar", "bat", "baz", "biz", "bingo", "boingo"],
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
      <div className="field is-grouped">
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
        <MultiSelect
            id="tags"
            options={this.options.tags}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

