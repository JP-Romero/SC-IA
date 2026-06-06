import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Setup Web Push
const publicKey = process.env.VITE_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:soporte@salud-conecta.com';

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

const DAILY_MESSAGES = [
  "Realiza una evaluación rápida de tu estado de salud.",
  "¿Tienes algún síntoma o duda? Recibe orientación en minutos.",
  "Hace varios días que no registras cómo te sientes. ¿Quieres actualizar tu estado?",
  "Completa tu información para recibir recomendaciones más precisas.",
  "Consejo del día: Mantenerte hidratado puede ayudarte a prevenir fatiga y dolores de cabeza."
];

export default async function handler(req, res) {
  // Asegurarnos que esto se ejecuta solo con la autorización o es un entorno seguro de Vercel (opcional: añadir check de cron)
  // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  if (!supabase || !publicKey || !privateKey) {
    return res.status(500).json({ error: 'Configuración de base de datos o Web Push faltante.' });
  }

  try {
    // 1. Obtener todas las suscripciones push de Supabase
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription');

    if (error) {
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({ message: 'No hay suscripciones para notificar.' });
    }

    // 2. Elegir un mensaje aleatorio
    const randomIndex = Math.floor(Math.random() * DAILY_MESSAGES.length);
    const message = DAILY_MESSAGES[randomIndex];

    const notificationPayload = JSON.stringify({
      title: 'Salud-Conecta IA',
      body: message,
      url: '/'
    });

    // 3. Enviar notificaciones a todas las suscripciones
    const sendPromises = subscriptions.map((subRecord) => {
      const pushSubscription = subRecord.subscription;
      return webpush.sendNotification(pushSubscription, notificationPayload)
        .catch((err) => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log('Subscription has expired or is no longer valid: ', err);
            // Idealmente deberíamos eliminarla de la BD aquí
          } else {
            console.error('Error sending push: ', err);
          }
        });
    });

    await Promise.all(sendPromises);

    return res.status(200).json({
      message: `Notificaciones enviadas a ${subscriptions.length} usuarios.`,
      success: true
    });
  } catch (err) {
    console.error('Cron Error:', err);
    return res.status(500).json({ error: 'Error procesando notificaciones', details: err.message });
  }
}
