# Medusa-Plugin-PriceFX

The medusa-plugin-pricefx is an exchange rate conversion tool that integrates with services such as [Frankfurter](https://frankfurter.dev/), [Exchangerate API](https://www.exchangerate-api.com/), and [CurrencyLayer](https://currencylayer.com/). The specific service used can be configured based on user preferences.

[![example]](https://github.com/user-attachments/assets/d0979b81-cc3f-4569-b91e-01379f201e26)



## ⚠️ Warn
>| Requires Medusa v2.7.0 or later.

## List
| platform         | Free Limit      | update time |
| ---------------- | --------------- | ----------- |
| Frankfurter      | no limits       | day         |
| Exchangerate API | 1500 reqs/month | day         |
| CurrencyLayer    | 100 reqs/mo     | real-time   |


## Installaction
```
npm i medusa-plugin-pricefx
```


## Configure
```js
// medusa-config.js
plugins: [
    {
      resolve: "medusa-plugin-imagekit",
      options: {
        platform: {'frankfurter'|'currency-layer':'exchange-rate'},
        access_token: '', // may need
        ttl:0, // The default value is 3600, 0 means no cache
      },
    }
]

```
