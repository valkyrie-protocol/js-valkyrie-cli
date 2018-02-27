import i18n from 'i18next'
import pl from './pl.json'
import en from './en.json'

i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en,
    pl
  }
});

export default  i18n
