import React from 'react';
import { Button, DropdownButton, Dropdown, Alert } from 'react-bootstrap';

class SendVoucherComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        selectedCampaign: '',
        selectedCampaignId: ''
      }
    }

    sendCoupon() {
      let customersToSend = [];

      this.props.selectedCustomers.forEach((user) => {
        customersToSend.push({
            userPhone: user.phoneNumber
        })
      });

      fetch('/send-vouchers', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
            campaignName: this.state.selectedCampaignId,
            customers: customersToSend
          })
      })
      .then(response => {
          console.log(response.json());
      });
    }

    selectCampaign(campaignId) {
      const campaignToSet = this.props.campaignsList[campaignId];

      this.setState(prevState => ({
        ...prevState,
        selectedCampaign: campaignToSet,
        selectedCampaignId: campaignToSet.name
      }));
    }

    render() {
        let isCampaignSelected = this.state.selectedCampaign !== '';

        return <div className='customers-vouchers'>
            <div className='component-header'>
            First choose what kind of communication would you like to use, to send coupon
                to the Customer.
                Then, select campaign from wich coupon will be sent and press OK.
            </div>
            <div className='customer-vouchers-container'>
                <DropdownButton
                    title='Choose campaign'
                    variant='primary'
                    id='dropdown-variants-primary'
                    className='choose-campaign-dropdown'
                >
                <Dropdown.Divider />
                { this.props.campaignsList.map((campaign, index) =>
                    <div key={index}>
                        <Dropdown.Item
                            onSelect={this.selectCampaign.bind(this)}
                            eventKey={index.toString()}
                        >
                            {campaign.name}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                    </div>
                )}
                </DropdownButton>
                { isCampaignSelected ? (
                    <div
                        className='campaign-name-container'>
                        <Alert variant={'info'}>
                            {this.state.selectedCampaign.name}
                        </Alert>
                    </div>
                    )
                    :
                    <div>Choose your campaign!</div>
                }
            </div>
            { isCampaignSelected ? (
                <div className='campaign-description'>
                    {this.state.selectedCampaign.description}
                </div>
                )
                :
                <div></div>
            }
            <div className='send-coupon-button-container'>
            <Button variant='outline-primary' onClick={this.sendCoupon.bind(this)}>
                Send coupon
            </Button>
            </div>
        </div>
    }
  }

  export default SendVoucherComponent;