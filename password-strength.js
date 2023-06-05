/*!
  * Password Strength Checker v1.0.1 (https://www.interart.com/)
  * Copyright 2023 Silvio Delgado (https://github.com/silviodelgado)
  * Licensed under MIT (https://opensource.org/licenses/MIT)
  * https://github.com/silviodelgado/passwordStrength
  * 
  */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.PwdStr = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    const options = {
        container_selector: null,
        element_selector: null,
        minimum_size: 8,
        container: null,
        element: null,
        bar: null,
        upper: true,
        lower: true,
        number: true,
        special: true,
        locale: {
            password_strength: 'Password strength',
            very_weak: 'Very Weak',
            weak: 'Weak',
            medium: 'Medium',
            strong: 'Strong'
        }
    };

    const create_bar = () => {
        let pb = document.querySelector('#pwd-strength .progress');
        if (pb) {
            return pb.querySelector('.progress-bar');
        }
        let pwd = document.createElement('div');
        pwd.classList.add('progress');
        let pwd_bar = document.createElement('div');
        pwd_bar.classList.add('progress-bar');
        pwd_bar.style.width = '1%';
        pwd.appendChild(pwd_bar)
        options.container.appendChild(pwd);
        return pwd_bar;
    };

    const init = () => {
        options.bar = create_bar();

        options.element.addEventListener('keyup', function (evt) {
            check(evt.target.value);
        });
    };

    const check = (password) => {
        options.bar.classList.remove('bg-success', 'bg-light', 'bg-danger', 'bg-primary', 'bg-info', 'bg-warning');
        options.bar.style = null;

        if (password.length == 0) {
            options.bar.classList.add('bg-secondary');
            options.bar.style.width = '100%';
            options.bar.innerHTML = options.locale.password_strength;
            return;
        }

        let regex = new Array();
        regex.push("[A-Z]", "[a-z]", "[0-9]", "[$@$!%*#?&]");

        let score = 0;
        for (let i = 0; i < regex.length; i++) {
            if (new RegExp(regex[i]).test(password))
                score++;
        }

        if (password.length < (options.minimum_size / 2)) {
            score = 2;
        } else if (password.length < options.minimum_size) {
            score = 3;
        }

        const strength = {
            class: '',
            num: '',
            name: ''
        };
        switch (score) {
            case 2:
                strength.class = 'bg-warning';
                strength.num = '50%';
                strength.name = options.locale.weak;
                break;
            case 3:
                strength.class = 'bg-info';
                strength.num = '75%';
                strength.name = options.locale.medium;
                break;
            case 4:
                strength.class = 'bg-success';
                strength.num = '100%';
                strength.name = options.locale.strong;
                break;
            default: 
                strength.class = 'bg-danger';
                strength.num = '25%';
                strength.name = options.locale.very_weak;
                break;
        }

        options.bar.classList.add(strength.class);
        options.bar.style.width = strength.num;
        options.bar.innerHTML = strength.name;
    };

    let PwdStr = (params) => {
        Object.assign(options, params || {});
        options.element = typeof options.element_selector === 'string' ? document.querySelector(options.element_selector) : options.element;
        if (!options.element || typeof options.element === 'undefined' || typeof options.element !== 'object' || (options.element.type != 'password' && options.element.type != 'text')) {
            throw new Error('Invalid element selector.');
        }
        options.container = typeof options.container_selector === 'string' ? document.querySelector(options.container_selector) : options.container;
        if (!options.container || typeof options.container === 'undefined' || options.container.tagName != 'DIV') {
            throw new Error(('Invalid container selector.'));
        }
        init();
    };

    return PwdStr;
});