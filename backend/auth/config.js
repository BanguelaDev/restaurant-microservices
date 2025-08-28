// Configurações do Firebase
// Substitua com suas próprias configurações do Firebase Console

const firebaseConfig = {
  type: "service_account",
  project_id: "restaurant-microservices",
  private_key_id: "8d1406bcad5a80e0188b7f295c1cecd91d3c4959",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuscSeWiQQ63mT\nd++tYrybHNmlxny9u603fI2c+/UoLxC4e2+U/YaZBUcxHvx3qmBQsIBFdHsvaRWm\nW4nbhxZuuj4+hvVT18Nj3w6AZGL/a8tyiwB/s4+qUkLwBefx+DjAOW8+uas+pret\nJQk4NWF8qf8NNC07v4dM+orTzRtFh952mgIx8jAkiJ9+OK5zmv0ihV0zLdjyfwHo\naXXphWq6peY2kUYT4+k7jdqtReIGUfpiazg7Q0tCfa39qPPk0AEcmPOLeoGo1a5a\nF5pgz2+G9TiGs9e3T3JL51HQiSouQ/aOxHlbEKRTni2x9Pf6T54+nXqmsHlsATJt\nj21ZWUalAgMBAAECggEADbaNqSKJTzy0y/MvwMwN4x02JpG4rAol9EOWODr9CRz8\nsoaaATePj8Z+yqfUiK46pkrcntcgbl3Q4cCwxydJBwMerLjaXC0FPPs+/6whq0wy\nabjonp2hSuzvLTlBdliWV9yKU4GupBnhNDnCigOCtg8AIvC0FksYG15VdH/WwrPg\n91lz6ibodYpkA4ut+Kh6TZosIikldWfBGO0CyDkGiVTFU4iCe+lbGHXBXqvGNjpz\nwxjqWMwCZJSWAzVy1kGcAA1ssNxprMk74Q1OIgA6Z5eNIABtTflHkbIox0xt8WA/\nr5+Imik86Ptm5xxapBIBKLBRF5L2+/Lo0gHDNOcZtwKBgQDZfSnToUdQg8cog/MP\n7EimdTpYPRQ/wtf6tB5RN5e89/S8j5Sr1WNkpvrPDA/VucHB9+MNLfBFUZ1+OMjP\nYuuBVIJ4W3hAQSTdwMLMpm5YEn3Cw96SDrxmEtPibP8uE+zAnvUNIrN+zZQUDqKo\nD4yS65jZwfBF6iTe/Flgdrd9kwKBgQDNoLeAngMyAuTEolujVrTxlOkzX2HYwR7n\nhZlb0c98Os1LkyPQY5Uk0qKHo9dhw9WdIbiwVCSC43dIr2FfN1oZPTskwwZvBtvN\nBtkWHckZQV0GkMUiTsABZqV8zT9t8WCJt54/LQ0NIRtZLupr9izNPJn/61dmV+RM\noQc2ug+N5wKBgG/As5xN08IYZF56Jov5An+d3uP2RpBYwvfMU4OyCCMOWdAGCwOc\nexz9/AQlk4FjmJ7di+p6v2ou/Lkd3nlJv+9NiFjlz01c69+SK8ZSgoJ4xewtDxGH\nxuDALeW70gdQL6fuRcaBHTA73CnON2AZ1UatDnZeA+M448c8bYR2m+RHAoGBAKx9\n5XE/G+8X/k/04mpikecVw4oUuT/awNH2gG9F0YekzBJZm/Fzl+kLyMt/5W1dmhP1\n9bf03avupGGUvVniVPJXKwXrk7oPRtL2q6Sh19AXxLF9P+FHrkl+kdPfWRYhJZph\nLZ5RbGFXJFnrwTpPh8Wi0IyeHvL7R8gATMzbx7CBAoGAV8CsJRun34gYxaOUGP6J\nDVqFmmYlg72cEmXcGLglgsgXLqOXkhaJk6RtUb7odDPMrE+mtKajJtyDBhkdCToM\nZgrqX1Ft7z6pSIZ5VQZ7UGTB2D0k/7hT7TCdW9TBwWxVVvlYkHqE/wxfQhqC5bsb\nDbwpPl7BgxkdNtuYbA+1RBo=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@restaurant-microservices.iam.gserviceaccount.com",
  client_id: "106068316259236761577",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40restaurant-microservices.iam.gserviceaccount.com"
};

module.exports = firebaseConfig;
