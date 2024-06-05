/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Router, Route, Navigate } from "@solidjs/router";
import App from './pages/App';

import "./bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

const Swilib = lazy(() => import("./pages/Swilib"));
const SwilibPhone = lazy(() => import("./pages/SwilibPhone"));

let dispose = render(() => (
	<Router root={App} base={import.meta.env.BASE_URL}>
		<Route path="/" component={() => <Navigate href={() => "/swilib"} />} />
		<Route path="/swilib" component={Swilib} />
		<Route path="/swilib/phone" component={SwilibPhone} />
	</Router>
), document.getElementById('root'));

import.meta.hot && import.meta.hot.dispose(dispose); // for HMR
