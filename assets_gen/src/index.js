import React from 'react';
import store from './store';
import App from './App';
import $ from 'jquery';

import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';

import "./less/index.less";

$(function () {
    $.fn.extend({ // @ts-ignore
        qcss: function (css) {
            return $(this).queue(function (next) {
                $(this).css(css);
                next();
            });
        }
    });
    
    createRoot($('root')[0]).render(<Provider store={store}><App /></Provider>);
});
