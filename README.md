# @domain.js/aes
aes encode and decode functions for domain.js internal

[![Build status](https://travis-ci.com/domain-js/aes.svg?branch=master)](https://travis-ci.com/domain-js/aes)
[![codecov](https://codecov.io/gh/domain-js/aes/branch/master/graph/badge.svg)](https://codecov.io/gh/domain-js/aes)

# Installation
<pre>npm i @domain.js/aes --save</pre>

# Usage
<pre>
const { encrypt, decrypt } = require('@domain.js/aes').main();

const key = "123";
const msg = aes.encrypt("hello world", key);
// msg is a string content may be 'U2FsdGVkX1/fmnlF0cEV4evuMptXZ/1bZMcq3lp0l7A='
// Notice: AES encryption results may be inconsistent every time

const txt = aes.decrypt(msg, key);
// txt is 'hello world'
</pre>
