import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Button } from 'react-bootstrap';
import Papa from 'papaparse';

import NavigationComponent from './components/navigation-component';
import SendVoucherComponent from './components/send-voucher-component';

const routes = {
  main: '/',
  import: '/customers-import',
  vounchers: '/customers-vouchers'
}

class App extends React.Component {
  constructor() {
    super();

    this.fileInput = React.createRef();
    this.state = {
      customersCsvContent: '',
      apiData: {
        customers: [],
        campaigns: []
      }
    };
  }

  componentDidMount() {
    fetch('/customers')
      .then(response => response.json())
      .then(response => {
        this.setState(prevState => ({
          apiData: {
            ...prevState.apiData,
            customers: response
          }
        }))
      });

    fetch('/campaigns')
      .then(response => response.json())
      .then(response => {
        this.setState(prevState => ({
          apiData: {
            ...prevState.apiData,
            campaigns: response
          }
        }))
      });
  }

  putCustomersFromCsv = event => {
    event.preventDefault();

    this.setState(prevState => ({
      apiData: {
        ...prevState.apiData,
        customers: Papa.parse(this.state.customersCsvContent, {
          header: true,
          dynamicTyping: true
        }).data
      }
    }))
  }

  handleCsvFileInput = () => {
    this.fileInput.current.files[0].text().then(importedCsvRawText => {
      this.setState(prevState => ({
        ...prevState,
        customersCsvContent: importedCsvRawText
      }))
    });
  }

  handleCustomersCsvText = event => {
    event.persist();

    this.setState(prevState => ({
      ...prevState,
      customersCsvContent: event.target.value
    }))
  }

  render() {
    return (
      <div className="App">
        <Router>
          <header className="App-header">
            <NavigationComponent
              routes={routes}
            />
          </header>
          <div className="Main">
          <Switch>
            <Route exact path={routes.main}>
              <CustomersListComponent
                list={this.state.apiData.customers}
              />
            </Route>
            <Route path={routes.import}>
              <div className='customers-import'>
                <div className='component-header'>
                  Paste your CSV content with your own customers list or press 'Choose File' to import from CSV file.
                </div>
                <form onSubmit={this.putCustomersFromCsv.bind(this)}>
                <textarea
                  className='customers-input'
                  rows={10}
                  cols={50}
                  onChange={this.handleCustomersCsvText.bind(this)}
                  value={this.state.customersCsvContent}
                >
                </textarea>
                  <p>
                    Import from file:
                   <input type="file" onChange={this.handleCsvFileInput.bind(this)} ref={this.fileInput} />
                  </p>
                  <Button variant='outline-primary' type='submit'>Add customers</Button>
                </form>
              </div>
            </Route>
            <Route path={routes.vouchers}>
              <SendVoucherComponent
                selectedCustomers={this.state.apiData.customers}
                campaignsList={this.state.apiData.campaigns}
              />
            </Route>
          </Switch>
        </div>
        </Router>
      </div>
    );
  }
}

const CustomersListComponent = props => {
  return <div>
      <div className='component-header'>
        This is list of customers loaded from Voucherify API.
        Go to 'Import' to get your own customers list from CSV.
      </div>
      <div className='customers-list'>
        {props.list.map(customer =>
          <div className='customer' key={customer.id}>
            {customer.name}, {customer.phoneNumber}
          </div>
        )}
      </div>
    </div>
}

export default App;