import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import { NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY } from './constants';
import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            satInfo: null,
            satLists: null,
            setting: null,
            isLoadingList: false,
        };
    }
    render() {
        const { isLoadingList, satInfo, satList, settings } = this.state;
        return (
            <Row className="main">
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite} />
                    <SatelliteList
                        isLoad={isLoadingList}
                        satInfo={satInfo}
                        onShowMap={this.showMap}
                    />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={settings} />
                </Col>
            </Row>
        );
    }

    //define this cb func in parent main component to get selected sat info
    //to its parent: main from child: satellitelist. Pass this satlist to its child: worldmap
    showMap = (selected) => {
        this.setState((preState) => ({
            ...preState,
            satList: [...selected],
        }));
    };

    showNearbySatellite = (setting) => {
        this.setState({
            isLoadingList: true,
            settings: setting,
        });
        //after this callback function getting satsetting data from child component,
        //we will fetch satellite list from the server by passing this value
        this.fetchSatellite(setting);
    };

    fetchSatellite = (setting) => {
        //fetch all geo info from setting
        const { latitude, longitude, elevation, altitude } = setting;

        //config API
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        this.setState({
            isLoadingList: true,
        });

        //always use axios to send request to the server
        axios
            .get(url)
            .then((response) => {
                //data is the satellite list info sending back from the backend server
                console.log(response.data);
                this.setState({
                    satInfo: response.data,
                    isLoadingList: false,
                });
            })
            .catch((error) => {
                console.log('err in fetch satellite -> ', error);
            });
    };
}

export default Main;
