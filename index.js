(async function () {
    const sendMessageUrl = 'https://ricardoeisabela-wedding.herokuapp.com/api/messages';
    const getTransmissionLinkUrl = 'https://ricardoeisabela-wedding.herokuapp.com/api/configurations';
    const url = new URL(window.location.href);

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
                const transmissionUrl = await fetch(`${getTransmissionLinkUrl}?key=transmissionUrl`).then(_ => _.text());
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