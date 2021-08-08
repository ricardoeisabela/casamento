(async function () {
    const sendMessageUrl = 'https://prod-81.westus.logic.azure.com:443/workflows/a219c1eb36b24a22b3dde9defe36b7cc/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KGeQlVe6VujwgRhizAdB44akjTqhM8JpTg_IfFi_O2w';
    const getTransmissionLinkUrl = 'https://prod-124.westus.logic.azure.com:443/workflows/1c8e1b831bcb47e7b4823b23fb9e3307/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_OCHCbHT3DfZeczsQZ_T5YXStf669-zoT8HsGdJW9Y4';
    const getLimitExceededUrl = 'https://prod-11.westus.logic.azure.com:443/workflows/429688c1071c4523ab9e53705b371ed4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vMGRgEec6F-zxe0P7PgifcLBUFXwNCKk1pca6JNnes4';
    const postPersonsUrl = 'https://prod-34.westus.logic.azure.com:443/workflows/331f2eedf8884f1f9eb1cac2959380ba/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XOcN4ZMMfJ3pmkjmJUufwN9wsbZm9FnRsFdlmQvfE7E';
    const url = new URL(window.location.href);
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    new Vue({
        el: '.app',
        data: {
            initialized: false,
            invitationOpened: false,
            showCompleteAddress: false,
            showMap: false,
            photo: '',
            showInfos: false,
            focusField: '',
            tag: url.searchParams.get('tag'),
            alert: {
                text: '',
                type: '',
                show: false
            },
            transmissionUrl: null,
            loading: false,
            message: {
                name: '',
                message: ''
            },
            timeout: null,
            music: document.getElementById('music'),
            musicMuted: false,
            currDate: new Date()
        },
        created: async function () {
            const self = this;

            const delayInit = async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                self.initialized = true;
            };

            const getTransmissionLink = async () => {
                const transmissionUrl = await fetch(getTransmissionLinkUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        title: 'LinkTransmissao'
                    })
                }).then(_ => _.text());

                self.transmissionUrl = transmissionUrl;
            };

            await Promise.all([delayInit(), getTransmissionLink()]);
        },
        methods: {
            openInvitation: function () {
                this.invitationOpened = true;
                this.music.play();
            },
            setAlert: function (text, type, show) {
                this.$set(this.alert, 'text', text);
                this.$set(this.alert, 'type', type);
                this.$set(this.alert, 'show', show);
            },
            showInfoAlert: function (text) {
                const self = this;
                this.setAlert(text, 'info', true);
                this.timeout = setTimeout(() => self.alert.show && self.$set(self.alert, 'show', false), 5000);
            },
            showDangerAlert: function (text) {
                const self = this;
                this.setAlert(text, 'danger', true);
                this.timeout = setTimeout(() => self.alert.show && self.$set(self.alert, 'show', false), 5000);
            },
            setLoading: function (show) {
                this.loading = show;
                this.setAlert(show && 'Carregando', show && 'info', show);
            },
            copyToClipboard: function (text) {
                const el = document.createElement('textarea');
                el.value = text;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            },
            copyTransmissionUrl: function () {
                if (this.transmissionUrl) {
                    this.copyToClipboard(this.transmissionUrl);
                    this.showInfoAlert('Link de Transmissão Copiado!');
                } else {
                    this.showDangerAlert('Link de Transmissão indisponível');
                }
            },
            openTransmissionUrl: function () {
                if (this.transmissionUrl) {
                    window.open(this.transmissionUrl, '_blank');
                } else {
                    this.showDangerAlert('Link de Transmissão indisponível');
                }
            },
            sendMessage: async function () {
                if (!this.message.name)
                    return this.showDangerAlert('Preencha seu nome');
                if (!this.message.message)
                    return this.showDangerAlert('Preencha sua mensagem');

                this.setLoading(true);
                await fetch(sendMessageUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(this.message)
                });

                this.setLoading(false);
                this.message = {
                    name: '',
                    message: ''
                };

                await new Promise(resolve => setTimeout(resolve, 300));
                this.showInfoAlert('Sua mensagem foi enviada!');
            },
            dismissAlert: function () {
                this.timeout && clearTimeout(this.timeout);
                this.timeout = null;
                this.setAlert('', '', false);
            },
            toggleSound: function () {
                this.music.muted = !this.music.muted;
                this.musicMuted = !this.musicMuted;
            }
        }
    });
})();