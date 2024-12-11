import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generatetid } from '../helpers/tokens.js';
import { emailAfterRegister } from '../helpers/email.js';
import { emailAfterPasswordChange } from '../helpers/email.js';
import bcrypt from 'bcrypt';

// Renderizar formulario de inicio de sesión
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autenticado: false,
        page: 'Ingresa a la plataforma',
    });
};

// Renderizar formulario de registro
const formularioRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crea una nueva cuenta',
    });
};

// Crear un nuevo usuario
const createNewUser = async (req, res) => {
    console.log("Datos recibidos:", req.body); // Verifica los datos del formulario

    // Validaciones
    await check('nombre_usuario').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('correo_usuario').notEmpty().withMessage('El correo electrónico es un campo obligatorio')
        .isEmail().withMessage('No es un email correcto').run(req);
    await check('pass_usuario').notEmpty().withMessage('La contraseña es un campo obligatorio')
        .isLength({ min: 8 }).withMessage('La contraseña debería tener al menos 8 caracteres').run(req);
    await check('pass2_usuario').equals(req.body.pass_usuario).withMessage('Las contraseñas no coinciden').run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        console.log("Errores de validación:", result.array());
        return res.render('auth/register', {
            page: 'Error al intentar crear la cuenta',
            errors: result.array(),
            user: {
                name: req.body.nombre_usuario,
                email: req.body.correo_usuario,
            },
        });
    }

    const { nombre_usuario: name, correo_usuario: email, pass_usuario: password } = req.body;

    // Verificar que el usuario no exista
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        console.log("Usuario existente:", existingUser);
        return res.render('auth/register', {
            page: 'Error al intentar crear la cuenta de Usuario',
            errors: [{ msg: `El usuario ${email} ya está registrado.` }],
            user: { name },
        });
    }

    
    // Crear nuevo usuario
    try {
        const newUser = await User.create({
            name,
            email,
            password,
            token: generatetid(),
            confirmacion: false,
            
        });
    
        console.log("Usuario creado exitosamente:", newUser);
    
        // Enviar correo de confirmación
        await emailAfterRegister({
            name: newUser.name,
            email: newUser.email,
            token: newUser.token,
        });
    
        res.render('templates/message', {
            page: 'Cuenta creada correctamente',
            message: `Hemos enviado un email de confirmación al correo: ${email}`,
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
    
};

// Confirmar cuenta
const confirm = async (req, res) => {
    const { token } = req.params;
    console.log(`Token recibido: ${token}`); // Verificar si el token se está recibiendo correctamente

    // Verificar si el token es válido
    const user = await User.findOne({ where: { token } });
    if (!user) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta...',
            msg: 'Hubo un error al confirmar tu cuenta, intenta de nuevo.',
            error: true,
        });
    }
    
    // Confirmar la cuenta
    user.token = null;
    user.confirmacion = true; 
    await user.save(); // Guardar cambios

    console.log("Usuario confirmado:", user);

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        msg: 'La cuenta se ha confirmado correctamente.',
        error: false,
    });
};

// Renderizar formulario de recuperación de contraseña
const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page: 'Recupera tu contraseña',
    });
};


const recuperarPassword = async (req, res) => {
    const { email, password_usuario } = req.body;

    // Verificar si se recibieron los datos necesarios
    if (!email || !password_usuario) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu contraseña',
            msg: 'Todos los campos son obligatorios',
            error: true
        });
    }

    try {
        // Verificar si el correo electrónico existe en la base de datos
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.render('auth/passwordRecovery', {
                page: 'Recupera tu contraseña',
                msg: 'No encontramos un usuario con ese correo',
                error: true
            });
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_usuario, salt);

        // Actualizar la contraseña en la base de datos
        user.password = hashedPassword;
        await user.save();

        // Enviar correo de confirmación de cambio de contraseña
        await emailAfterPasswordChange({
            name: user.name,
            email: user.email
        });

        // Renderizar el mensaje de éxito
        return res.render('templates/message', {
            page: 'Contraseña actualizada',
            message: 'Tu contraseña ha sido actualizada correctamente. Se ha enviado un correo de confirmación.',
        });

    } catch (error) {
        console.error('Error al recuperar la contraseña:', error);
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu contraseña',
            msg: 'Hubo un error al intentar recuperar tu contraseña. Intenta de nuevo más tarde.',
            error: true
        });
    }
};

export {
    formularioLogin,
    formularioRegister,
    createNewUser,
    confirm,
    formularioPasswordRecovery,
    recuperarPassword,
};
