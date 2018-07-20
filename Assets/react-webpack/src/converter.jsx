require("react-hot-loader/patch")
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Converter from './Converter/Converter';
import BrowserUpgradeRequired from './SharedItems/BrowserUpgradeRequired';

$(document).ready(function() {

	var target = $('#converter');

	if (Modernizr.filereader) {

		render(
			<AppContainer><Converter /></AppContainer>,
			target[0]);

		if (module && module.hot) {

		  module.hot.accept('./Converter/Converter.jsx', () => {
		    const Checkout = require('./Converter/Converter.jsx').default;
		    render(
			     <AppContainer><Converter /></AppContainer>,
				target[0]
		    );
		  });
		}

	} else {

		render(<AppContainer><BrowserUpgradeRequired /></AppContainer>, target[0]);

	}

});