const styles_root =
    `
    :root {
        --alert-container-color: rgba(87, 59, 59, 0.6);
        --alert-background: #e6b5b5;
        --icon-warning: #999c6d;
        --icon-error: #aa5656;
        --icon-success: #3e836d;
        --alert-title-color: #573b3b; 
        --alert-text-color: #7c7474;
        --btn-primary: #3e836d;
        --btn-secondary: #aa5656;
        --btn-hover: rgba(87, 59, 59, 0.1);
    }
    `;

const styles = $('<style>', {
    id: "alert-styles",
    text:
    `
        ${styles_root}
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
        }

        #alert-container {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 9999;
            background-color: var(--alert-container-color);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #alert {
            width: 90%;
            max-width: 400px;
            background-color: var(--alert-background);
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            text-align: center;
            animation: fadeIn 0.5s ease;
            position: relative;
        }

        #alert-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: var(--icon-warning);
            color: #fff;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #alert-close:hover {
            background-color: #ffa600;
        }

        #alert-title h1 {
            color: var(--alert-title-color);
            font-size: 24px;
            font-weight: bold;
        }

        #alert-text p {
            color: var(--alert-text-color);
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
        }

        #alert-buttons-container {
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        #alert-buttons-container button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        #alert-button-accept {
            background-color: var(--btn-primary);
        }

        #alert-button-accept:hover {
            background-color: #0074a8;
        }

        #alert-button-cancel {
            background-color: var(--btn-secondary);
        }

        #alert-button-cancel:hover {
            background-color: #d32f2f;
        }

        #alert-icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px 0;
        }

        .alert-warning-icon {
            position: relative;
            width: 0;
            height: 0;
            border: 34px solid transparent;
            border-top: 0;
            border-bottom: 68px solid var(--icon-warning);
            transform: rotate(45deg);
            animation: bounce 1.5s infinite ease-in-out;
        }

        .alert-warning-icon::before {
            content: '!';
            position: absolute;
            top: 25px;
            left: -5px;
            font-size: 32px;
            font-weight: bold;
            color: #fff;
        }

        .alert-error-icon {
            position: relative;
            width: 60px;
            height: 15px;
            background-color: var(--icon-error);
            border-radius: 8px;
            animation: Shake 1.5s ease-in-out infinite;
        }

        .alert-error-icon::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 60px;
            height: 15px;
            background-color: var(--icon-error);
            border-radius: 8px;
            transform: rotate(90deg);
        }

        .alert-success-icon {
            position: relative;
            width: 50px;
            height: 25px;
            border: 15px solid var(--icon-success);
            border-top: none;
            border-right: none;
            transform: rotate(-45deg);
            animation: zoom-in-out 2s ease-in-out infinite;
        }

        .rotated{
            transform: rotate(-45deg);
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        @keyframes Shake {
            0%, 100% {
                transform: rotate(0deg);
            }
            25%, 75% {
                transform: rotate(5deg);
            }
            50% {
                transform: rotate(-5deg);
            }
        }

        @keyframes zoom-in-out {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
        }
    `
});

function CreateAlert(title, icon, text, can_cancel = false, accept = () => {}, cancel = () => {}) {
    $('head').append(styles);
    const alert_container = $('<section>', { id: "alert-container" });
    const alert = $('<div>', { id: "alert" });

    const alert_close = $('<span>', { id: "alert-close", text: "X" }).click(function () {
        close_alert();
    });

    const alert_title = $('<div>', { id: "alert-title", html: `<h1>${title}</h1>` });
    const alert_icon_container = $('<div>', { id: "alert-icon-container", class: icon !== 'alert-warning-icon' ? 'rotated' : '' });
    const alert_icon = $('<span>', { id: "alert-icon", class: `${icon}` });

    const alert_text = $('<div>', { id: "alert-text", html: `<p>${text}</p>` });

    const alert_buttons_container = $('<div>', { id: "alert-buttons-container" });

    const alert_button_accept = $('<button>', { id: "alert-button-accept", text: "Aceptar" }).click(function () {
        accept();
        close_alert();
    });

    const alert_button_cancel = $('<button>', { id: "alert-button-cancel", text: "Cancelar" }).click(function () {
        cancel();
        close_alert();
    });

    alert_buttons_container.append(alert_button_accept);

    if (can_cancel) alert_buttons_container.append(alert_button_cancel);

    alert_icon_container.append(alert_icon);
    alert.append(alert_close, alert_title, alert_icon_container, alert_text, alert_buttons_container);

    return alert_container.append(alert);
}

function close_alert() {
    $('#alert-styles').remove();
    $('#alert-container').remove();
}

function showAlert(title, icon, text, can_cancel = false, close_timmer, accept = () => {}, cancel = () => {}) {
    if (isNaN(close_timmer) && close_timmer !== false) {
        throw new Error("close_timmer must be a number or false");
    }

    if (can_cancel !== true && can_cancel !== false) {
        throw new Error("can_cancel must be true or false");
    }

    const alert = CreateAlert(title, icon, text, can_cancel, accept, cancel);

    if (!$('#alert-styles').length) {
        $('head').append(styles);
    }

    $('body').append(alert);

    if (close_timmer !== false) {
        setTimeout(() => {
            close_alert();
        }, close_timmer);
    }
}

$(document).ready(function () {
    if ($('#show-alert').length > 0) {
        const new_alert = $('#show-alert')[0];
        const title = new_alert.getAttribute('title');
        const icon = new_alert.getAttribute('icon');
        const text = new_alert.getAttribute('text');
        const can_cancel = new_alert.getAttribute('can_cancel') === 'true';
        const close_timmer = parseInt(new_alert.getAttribute('close_timmer'), 10);

        showAlert(title, icon, text, can_cancel, close_timmer);
    }
});
