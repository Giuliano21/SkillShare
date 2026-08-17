const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SkillShare API',
    version: '1.0.0',
    description: 'Documentazione completa delle API di SkillShare per autenticazione, tutor, prenotazioni e recensioni.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Server locale di sviluppo'
    }
  ],
  tags: [
    { name: 'Health', description: 'Verifica dello stato del backend' },
    { name: 'Auth', description: 'Registrazione, login e refresh token' },
    { name: 'Users', description: 'Gestione profilo utente' },
    { name: 'Tutors', description: 'Ricerca tutor e disponibilità' },
    { name: 'Bookings', description: 'Prenotazioni e aggiornamento stato' },
    { name: 'Reviews', description: 'Recensioni ai tutor' },
    { name: 'Chats', description: 'Chat privata real-time tra tutor e studente' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345678' },
          name: { type: 'string', example: 'Mario' },
          surname: { type: 'string', example: 'Rossi' },
          username: { type: 'string', example: 'mariorossi' },
          email: { type: 'string', format: 'email', example: 'mariorossi@example.com' },
          role: {
            type: 'array',
            items: { type: 'string', enum: ['student', 'tutor'] },
            example: ['student']
          },
          status: { type: 'string', enum: ['active', 'deleted'], example: 'active' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'surname', 'username', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Mario' },
          surname: { type: 'string', example: 'Rossi' },
          username: { type: 'string', example: 'mariorossi' },
          email: { type: 'string', format: 'email', example: 'mariorossi@example.com' },
          password: { type: 'string', minLength: 6, example: 'secret123' },
          role: {
            oneOf: [
              { type: 'string', enum: ['student', 'tutor'] },
              { type: 'array', items: { type: 'string', enum: ['student', 'tutor'] } }
            ],
            example: ['tutor']
          },
          subjects: {
            type: 'array',
            items: { type: 'string' },
            example: ['Matematica', 'Fisica']
          },
          hourlyPrice: { type: 'number', example: 25 },
          bio: { type: 'string', example: 'Tutor esperto in matematica' },
          lessonMode: { type: 'string', enum: ['remote', 'presence'], example: 'remote' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'mariorossi@example.com' },
          password: { type: 'string', example: 'secret123' }
        }
      },
      AuthTokenResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9...' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              role: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        }
      },
      Tutor: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345679' },
          userId: { type: 'string', example: '64d1f4c9e1b44a0012345678' },
          subjects: {
            type: 'array',
            items: { type: 'string' },
            example: ['Matematica']
          },
          hourlyPrice: { type: 'number', example: 25 },
          bio: { type: 'string', example: 'Tutor esperto in matematica' },
          lessonMode: { type: 'string', enum: ['remote', 'presence'], example: 'remote' },
          rating: { type: 'number', example: 4.5 },
          reviewsCount: { type: 'integer', example: 12 }
        }
      },
      AvailabilitySlot: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345680' },
          tutorId: { type: 'string', example: '64d1f4c9e1b44a0012345679' },
          startDay: { type: 'integer', minimum: 1, maximum: 7, example: 1 },
          endDay: { type: 'integer', minimum: 1, maximum: 7, example: 1 },
          startTime: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', example: '09:00' },
          endTime: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', example: '10:00' },
          isBooked: { type: 'boolean', example: false }
        }
      },
      Booking: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345681' },
          userId: { type: 'string', example: '64d1f4c9e1b44a0012345678' },
          tutorId: { type: 'string', example: '64d1f4c9e1b44a0012345679' },
          slotId: { type: 'string', example: '64d1f4c9e1b44a0012345680' },
          subject: { type: 'string', example: 'Matematica' },
          status: { type: 'string', enum: ['pending', 'accepted', 'cancelled', 'completed'], example: 'pending' }
        }
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345682' },
          userId: { type: 'string', example: '64d1f4c9e1b44a0012345678' },
          tutorId: { type: 'string', example: '64d1f4c9e1b44a0012345679' },
          bookingId: { type: 'string', example: '64d1f4c9e1b44a0012345681' },
          rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', example: 'Ottimo tutor, molto disponibile' }
        }
      },
      Conversation: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345683' },
          participants: {
            type: 'array',
            items: { type: 'string' },
            example: ['64d1f4c9e1b44a0012345678', '64d1f4c9e1b44a0012345690']
          },
          participantsKey: {
            type: 'string',
            example: '64d1f4c9e1b44a0012345678:64d1f4c9e1b44a0012345690',
            description: 'Chiave unica normalizzata della coppia di partecipanti'
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      ConversationWithUsers: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345683' },
          participants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                username: { type: 'string' },
                name: { type: 'string' },
                surname: { type: 'string' },
                role: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Message: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345684' },
          conversationId: { type: 'string', example: '64d1f4c9e1b44a0012345683' },
          senderId: { type: 'string', example: '64d1f4c9e1b44a0012345678' },
          text: { type: 'string', example: 'Ciao, quando possiamo iniziare?' },
          isRead: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      MessageWithSender: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64d1f4c9e1b44a0012345684' },
          conversationId: { type: 'string', example: '64d1f4c9e1b44a0012345683' },
          senderId: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              username: { type: 'string' },
              name: { type: 'string' },
              surname: { type: 'string' },
              role: { type: 'array', items: { type: 'string' } }
            }
          },
          text: { type: 'string', example: 'Ciao, quando possiamo iniziare?' },
          isRead: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      SendMessageRequest: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', minLength: 1, maxLength: 1000, example: 'Ciao, quando possiamo iniziare?' }
        }
      },
      MessagesResponse: {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            items: { $ref: '#/components/schemas/MessageWithSender' }
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 30 },
              total: { type: 'integer', example: 120 },
              pages: { type: 'integer', example: 4 }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Errore del server' },
          error: { type: 'string', example: 'Dettaglio dell\'errore' }
        }
      }
    },
    responses: {
      Unauthorized: {
        description: 'Token JWT mancante o non valido',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      Forbidden: {
        description: 'Permessi insufficienti',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      },
      NotFound: {
        description: 'Risorsa non trovata',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    }
  },
  paths: {
    '/api/v1/health': {
      get: {
        tags: ['Health'],
        summary: 'Controllo dello stato del backend',
        responses: {
          '200': {
            description: 'Backend in funzione',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    message: { type: 'string', example: 'Il server è correttamente in funzione' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registra un nuovo utente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Utente registrato con successo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Utente registrato con successo' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Dati non validi o utente già esistente',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Esegue il login dell\'utente',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Login eseguito correttamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokenResponse' }
              }
            }
          },
          '401': {
            description: 'Credenziali non valide',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout e invalidazione refresh token',
        responses: {
          '200': {
            description: 'Logout eseguito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Logout effettuato con successo.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Genera un nuovo access token usando il refresh token',
        responses: {
          '200': {
            description: 'Nuovo access token generato',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Refresh token mancante o non valido',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    '/api/v1/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Recupera il profilo dell\'utente autenticato',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profilo utente recuperato',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Aggiorna il profilo dell\'utente autenticato',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  surname: { type: 'string' },
                  username: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  currentPassword: { type: 'string' },
                  newPassword: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Profilo aggiornato con successo',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Soft-delete del profilo utente',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profilo cancellato correttamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Profilo utente cancellato con successo' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/tutors': {
      get: {
        tags: ['Tutors'],
        summary: 'Recupera i tutor in base a filtri',
        parameters: [
          { name: 'subject', in: 'query', schema: { type: 'string' }, description: 'Materia da ricercare' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Prezzo minimo orario' },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Prezzo massimo orario' },
          { name: 'minRating', in: 'query', schema: { type: 'number' }, description: 'Valutazione minima' },
          { name: 'lessonMode', in: 'query', schema: { type: 'string', enum: ['remote', 'presence'] }, description: 'Modalità di lezione' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['subject', 'price', 'rating', 'lessonMode'] }, description: 'Campo di ordinamento' }
        ],
        responses: {
          '200': {
            description: 'Lista tutor',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    tutors: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Tutor' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/tutors/{id}': {
      get: {
        tags: ['Tutors'],
        summary: 'Recupera un tutor specifico',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Tutor trovato',
            content: { 'application/json': { schema: { type: 'object', properties: { tutor: { $ref: '#/components/schemas/Tutor' } } } } }
          },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/tutors/{id}/availability': {
      get: {
        tags: ['Tutors'],
        summary: 'Recupera disponibilità del tutor',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Disponibilità recuperata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    availabilitySlots: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AvailabilitySlot' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Tutors'],
        summary: 'Aggiunge una disponibilità per il tutor autenticato',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['startDay', 'endDay', 'startTime', 'endTime'],
                properties: {
                  startDay: { type: 'integer', minimum: 1, maximum: 7 },
                  endDay: { type: 'integer', minimum: 1, maximum: 7 },
                  startTime: { type: 'string', example: '09:00' },
                  endTime: { type: 'string', example: '10:00' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Disponibilità aggiunta con successo',
            content: { 'application/json': { schema: { type: 'object', properties: { availabilitySlot: { $ref: '#/components/schemas/AvailabilitySlot' } } } } }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      },
      put: {
        tags: ['Tutors'],
        summary: 'Aggiorna una disponibilità esistente del tutor',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  startDay: { type: 'integer' },
                  endDay: { type: 'integer' },
                  startTime: { type: 'string' },
                  endTime: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Disponibilità aggiornata' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Crea una nuova prenotazione',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tutorId', 'slotId', 'subject'],
                properties: {
                  tutorId: { type: 'string', example: '64d1f4c9e1b44a0012345679' },
                  slotId: { type: 'string', example: '64d1f4c9e1b44a0012345680' },
                  subject: { type: 'string', example: 'Matematica' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Prenotazione creata',
            content: { 'application/json': { schema: { type: 'object', properties: { booking: { $ref: '#/components/schemas/Booking' } } } } }
          },
          '400': { $ref: '#/components/responses/NotFound' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' }
        }
      },
    },
    '/api/v1/bookings/my-bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'Recupera tutte le prenotazioni dell\'utente autenticato',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Prenotazioni recuperate', content: { 'application/json': { schema: { type: 'object', properties: { bookings: { type: 'array', items: { $ref: '#/components/schemas/Booking' } } } } } } },
          '401': { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/v1/bookings/{id}/cancel': {
      patch: {
        tags: ['Bookings'],
        summary: 'Cancella una prenotazione da studente',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Prenotazione cancellata' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/bookings/{id}/status': {
      patch: {
        tags: ['Bookings'],
        summary: 'Aggiorna lo stato di una prenotazione da tutor',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['pending', 'accepted', 'completed'] }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Stato prenotazione aggiornato' },
          '400': { description: 'Stato non valido' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/reviews/{tutorId}': {
      get: {
        tags: ['Reviews'],
        summary: 'Recupera le recensioni di un tutor',
        parameters: [{ name: 'tutorId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Recensioni recuperate',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    reviews: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Review' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Crea una nuova recensione',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tutorId', 'bookingId', 'rating'],
                properties: {
                  tutorId: { type: 'string' },
                  bookingId: { type: 'string' },
                  rating: { type: 'number', minimum: 1, maximum: 5 },
                  comment: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Recensione creata', content: { 'application/json': { schema: { type: 'object', properties: { review: { $ref: '#/components/schemas/Review' } } } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { description: 'Prenotazione non completata o non valida' }
        }
      }
    },
    '/api/v1/reviews/{id}': {
      put: {
        tags: ['Reviews'],
        summary: 'Aggiorna una recensione esistente',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rating: { type: 'number', minimum: 1, maximum: 5 },
                  comment: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Recensione aggiornata' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Reviews'],
        summary: 'Elimina una recensione',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Recensione eliminata' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/chats/conversations': {
      get: {
        tags: ['Chats'],
        summary: 'Recupera tutte le conversazioni dell\'utente autenticato',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Conversazioni recuperate con successo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    conversations: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ConversationWithUsers' }
                    }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/v1/chats/conversations/with/{peerUserId}': {
      post: {
        tags: ['Chats'],
        summary: 'Crea o ottiene una conversazione privata con un peer',
        description: 'Apre una chat privata 1:1 tra l\'utente autenticato e il peer specificato. Richiede almeno una prenotazione accettata tra tutor e studente. La conversazione viene creata una sola volta per coppia di utenti e rimane disponibile anche se lo stato della prenotazione cambia.',
        security: [{ bearerAuth: [] }],
        parameters: [{
          name: 'peerUserId',
          in: 'path',
          required: true,
          schema: { type: 'string', example: '64d1f4c9e1b44a0012345690' },
          description: 'ID dell\'altro utente con cui aprire la chat'
        }],
        responses: {
          '200': {
            description: 'Conversazione disponibile o creata con successo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Conversazione disponibile.' },
                    conversation: { $ref: '#/components/schemas/Conversation' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Identificatori mancanti o peer coincide con l\'utente',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': {
            description: 'Chat non consentita: serve almeno una prenotazione accettata tra tutor e studente',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          }
        }
      }
    },
    '/api/v1/chats/conversations/{conversationId}/messages': {
      get: {
        tags: ['Chats'],
        summary: 'Recupera i messaggi di una conversazione con paginazione',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'conversationId',
            in: 'path',
            required: true,
            schema: { type: 'string', example: '64d1f4c9e1b44a0012345683' },
            description: 'ID della conversazione'
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Numero di pagina (default: 1)'
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 30 },
            description: 'Numero di messaggi per pagina (default: 30, max: 100)'
          }
        ],
        responses: {
          '200': {
            description: 'Messaggi recuperati con paginazione',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessagesResponse' }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      },
      post: {
        tags: ['Chats'],
        summary: 'Invia un messaggio in una conversazione',
        security: [{ bearerAuth: [] }],
        parameters: [{
          name: 'conversationId',
          in: 'path',
          required: true,
          schema: { type: 'string', example: '64d1f4c9e1b44a0012345683' },
          description: 'ID della conversazione'
        }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SendMessageRequest' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Messaggio inviato con successo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Messaggio inviato con successo.' },
                    data: { $ref: '#/components/schemas/MessageWithSender' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Testo mancante o supera limite 1000 caratteri',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/v1/chats/conversations/{conversationId}/read': {
      patch: {
        tags: ['Chats'],
        summary: 'Segna tutti i messaggi ricevuti della conversazione come letti',
        security: [{ bearerAuth: [] }],
        parameters: [{
          name: 'conversationId',
          in: 'path',
          required: true,
          schema: { type: 'string', example: '64d1f4c9e1b44a0012345683' },
          description: 'ID della conversazione'
        }],
        responses: {
          '200': {
            description: 'Messaggi segnati come letti',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Messaggi segnati come letti.' },
                    updatedCount: { type: 'integer', example: 5, description: 'Numero di messaggi aggiornati' }
                  }
                }
              }
            }
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
