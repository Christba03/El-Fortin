<?php
session_start();
?>

<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/fontawesome.css">
    <link rel="stylesheet" href="css/estilos.css"/>
    <title>El Fortin Panaderia</title>
    <link rel="icon" type="img/jpg" href="recursos/logo-removebg-preview.png" />
    <link rel="stylesheet" href="css/fonts.css">

  </head>
  <body>
    <header id="header">
      <div class="contenido-inicial">
        <div class="contenedor-inicial">
          <div class="soporte-cliente">
            <div class="contenido-soporte-cliente">
             <img src="recursos/fortin.jpeg" alt="" class="logoFortin">
            </div>
          </div>
              <div class="contenedor-logo">
                <h1 class="titleFont ">El Fortin Panaderia</h1>
              </div>
                   <div class="usuario-contenedor">
                   <?php if (isset($_SESSION["rol"]) && ($_SESSION["rol"] == 'administrador' || $_SESSION["rol"] == 'cliente')): ?>
             <!-- Mostrar el botón de cerrar sesión si el usuario ha iniciado sesión -->
                <form action="php/logoupt.php" method="post">
                 <button type="submit" class="btnSesion" id="add.user-btn">
                     <i class="fa fa-sign-out" aria-hidden="true"></i> Cerrar sesión
                   </button>
                </form>
           <?php else: ?>
               <!-- Mostrar el botón de iniciar sesión si el usuario no ha iniciado sesión -->
              <button type="button" class="btnSesion" id="add.user-btn" data-bs-toggle="modal" data-bs-target="#userModal">
                  <i class="fa fa-sign-in" aria-hidden="true"></i> Iniciar sesión
              </button>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <nav class="navbar navbar-expand-lg" id="nav-content">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="index.php">Inicio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#servicios">Servicios</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#nosotros">Acerca de nosotros</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#contactanos">Contáctanos</a>
              </li>
              <?php 
               if(isset($_SESSION["rol"]) && $_SESSION["rol"] == "administrador")
              {
              ?>
              <li class="nav-item">
                <a class="nav-link" href="paginas/panelAdministrativo/empleados.html">Panel administrativo</a>
              </li>
              <?php 
              }
              ?>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <!-- #header -->

    <!-- Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content" style="background-color: #f9f5f0">
          <div class="modal-header bg-primary">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5 class="btnlogin">Iniciar Sesión</h5>
            <form id="user-form" class="needs-validation" action="php/validarUsuarios.php" method="post" novalidate>
              <input type="hidden" name="accion" value="1">
              <div class="form-group">
                <label for="user-email">Correo</label>
                <input
                  type="email"
                  class="form-control"
                  name="correo"
                  id="user-email"
                  name="correo2"
                  required
                />
                <span id="correo2" name="correo2" style="color: red;"></span>
                <div class="invalid-feedback">
                  Ingrese un correo valido.
                </div>
              </div>
              <div class="form-group">
                <label for="user-password">Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="user-password"
                  name="contrasena"
                />
                <span id="contrasena2" name="contrasena2" style="color: red;"></span>
                <div class="invalid-feedback">
                  Ingrese una contraseña valida.
                </div>
              </div>
              <input type="hidden" id="user-id"/>
              <button type="submit" class="btn" id="inicia">Iniciar Sesion</button>
              <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#userRegistro">Registrarse</button>
            </form>
          </div>
        </div>
      </div>
    </div>
     <!-- Modal de Registro -->
     <div class="modal fade" id="userRegistro" tabindex="-1" aria-labelledby="modalUsuariosTitle" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalUsuariosTitle">Formulario de registro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="formUsuarios" action="php/insertar.php" method="post">
              <input type="hidden" name="accion" value="1">
              <div class="row">
              <div class="mb-3 col-md-6">
                <label for="nombre" class="form-label">Nombre:</label>
                <input type="text" class="form-control" id="nombre" name="letras1" placeholder="Nombre" maxlength="35">
                <span id="letras1" style="color: red;"></span>
              </div>

              <div class="mb-3 col-md-6">
                <label for="apellidoP" class="form-label">Apellido paterno:</label>
                <input type="text" class="form-control" id="apellidoP" name="letras2" placeholder="Apellido Paterno" maxlength="35" required>
                <span id="letras2" style="color: red;"></span>
              </div>

              <div class="mb-3 col-md-6">
                <label for="apellidoM" class="form-label">Apellido materno:</label>
                <input type="text" class="form-control" id="apellidoM" name="letras3" placeholder="Apellido Materno" maxlength="35" >
                <span id="letras3" style="color: red;"></span>
              </div>

              <div class="mb-3 col-md-6">
                <label for="numeroTelefono" class="form-label">Telefono:</label>
                <input type="text" class="form-control" id="numeroTelefono" name="numeroTelefono" placeholder="2711238909" minlength="10" maxlength="10" required>
              </div>
              </div>

              <hr>
              <div class="form-group">
                <label for="nombreUsuario" class="form-label">Nombre de usuario:</label>
                <input type="text" class="form-control" id="nombreUsuario" name="letras4" placeholder="example" maxlength="15" required>
                <span id="letras4" style="color: red;"></span>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="correo" class="form-label">Correo:</label>
                  <input type="email" class="form-control" id="correo" name="correo1" placeholder="Correo" maxlength="16" required>
                    <span id="correo1" name="correo1" style="color: red;"></span>
                </div>
                <div class="mb-3 col-md-6">
                  <label for="contrasena" class="form-label">Contraseña:</label>
                  <input type="password" class="form-control" id="contrasena" name="contrasena1" placeholder="Contraseña" required>
                  <span id="contrasena1" name="contrasena1" style="color: red;"></span>
                </div>
              </div>

              <input type="hidden" id="rol" name="rol" value="cliente">
              <input type="hidden" id="usuario-id">
              <button type="submit" class="btn btn-primary text-bg-primary">Guardar</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Carrusel -->

    <div
      id="carouselExampleCaptions"
      class="carousel slide"
      data-bs-ride="carousel"
    >

      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="recursos/promocion1.jpg" class="d-block w-100" alt="..." id="promos"/>
          <div class="carousel-caption d-none d-md-block">
          </div>
        </div>
        <div class="carousel-item">
          <img src="recursos/promocion2.jpg" class="d-block w-100" alt="..." id="promos"/>
          <div class="carousel-caption d-none d-md-block">
          </div>
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carouselExampleCaptions"
        role="button"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previo</span>
      </a>
      <a
        class="carousel-control-next"
        href="#carouselExampleCaptions"
        role="button"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </a>
    </div>

    <main class="main-content">
      <section class="contenido-categorias" id="servicios">
        <br>
        <h1 class="heading-1">Servicios</h1>
        <div class="container-categorias">
          <div class="card-category-concha-rosada">
            <p>Panaderia</p>
            <a href="paginas/Menus/panaderia.html"><span>Ver más</span></a>
          </div>
          <div class="card-category-cuernito">
            <p>Restaurante</p>
           <a href="paginas/Menus/restaurante.html"><span>Ver más</span></a>
          </div>
          <div class="card-category-capuchino">
            <p>Bebidas</p>
            <a href="paginas/Menus/bebidas.html"><span>Ver más</span></a>
          </div>
        </div>
      </section>

      <section class="container-products" id="nosotros">
        <br>
        <h1 class="heading-1">Acerca de nosotros</h1>
        <div class="about-us">
          <div class="text">
            <p>
            En El Fortín, nos dedicamos a crear productos recién hechos con ingredientes frescos y de alta calidad. Nuestros panaderos artesanos combinan tradición e innovación para ofrecer panes, pasteles y postres que deleitan los sentidos. Ubicados en el corazón de Fortín, ofrecemos una experiencia gastronómica única en un ambiente acogedor. ¡Descubre el auténtico sabor de El Fortín!
            </p>
          </div>
          <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="recursos/cuernito.jpg" class="d-block w-100" alt="Food Photo 1">
              </div>
              <div class="carousel-item">
                <img src="recursos/capucchino.jpg" class="d-block w-100" alt="Food Photo 2">
              </div>
              <div class="carousel-item">
                <img src="recursos/coffe1.jpg" class="d-block w-100" alt="Food Photo 3">
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        <!-- <div class="image-container">
              <div class="image image1">
                  <img src="recursos/cuernito.jpg" alt="Food Photo">
              </div>
          </div>
        -->
      </div>
      </section>
      <br>
      <br>

      <section class="container-products" id="contactanos">
        <div class="contact-us">
          <div class="text">
            <h1>Contáctanos</h1>
             <br>
             <p><i class="fa-solid fa-location-dot"></i> Avenida 3 & Calle 7, Centro, 94500 Córdoba, Ver.</p>
             <p><i class="fa-solid fa-location-dot"></i> Av. 4 910, Centro, 94500 Córdoba, Ver.</p>
             <p><i class="fa-solid fa-location-dot"></i> Av. 5 No.102 B, Centro, 94470 Fortín de las Flores, Ver.</p>
             <p>  <i class="fa fa-phone" aria-hidden="true"></i> +52 271-713-1390</p>
          </div>
          <div class="cardForm">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <div class="content-image">
                    <img src="recursos/contacto.png" class="img-fluid rounded-start" alt="...">
                  </div>
                </div>
                <div class="col-md-8" style="background-color: #f7ebdc;">
                  <div class="card-body">
                    <h5 class="card-title">Danos tu opinión</h5>
                    <br>
                    <form action="">
                      <div class="mb-3">
                        <label for="inputFullName" class="form-label">Asunto</label>
                        <input type="text" class="form-control" id="inputFullName" name="letras1" maxlength="20" required>
                        <span id="letras1" style="color: red;"></span>
                      </div>
                      <div class="mb-3">
                        <label for="inputTextarea" class="form-label">Comentario</label>
                        <textarea class="form-control" id="inputTextarea" name="charEsp1" rows="3" required ></textarea>
                        <span id="charEsp1" name="charEsp1" style="color: red;"></span>         

                      </div>
                      <button type="submit" class="btn btn-primary text-bg-primary">Enviar</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="text-white pt-5 pb-4" id="container-footer">
      <div class="container text-center text-md-left">
        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-6">
            <h3 class="mb-4 font-weight-bold">Contáctanos</h3>
            <div class="textwidget">
              <p class="contactos">
                <i class="fa fa-phone" aria-hidden="true" id="hasicon"></i>
                +52 271-713-1390
              </p>
              <p class="contactos">
                <i class="fa-solid fa-location-dot" id="hasicon"></i>
                Av. 5 No.102 B, Centro, 94470 Fortín de las Flores, Ver.
              </p>
              <p class="contactos">
                <i class="fa fa-globe" aria-hidden="true" id="hasicon"></i>
                https://www.el-fortin-panaderia.com.mx
              </p>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6">
            <div class="widget m-b-40 clearfix widget_text text-11">
              <div class="textwidget">
                <p>
                  <img
                    class="m-b-50"
                    src="recursos/fortin.jpeg"
                    alt="El Fortin Panaderia"
                    id="logoF"
                  />
                </p>
              </div>
              <h3 class="mb-4 font-weight-bold">Siguenos en:</h3>
              <div class="facebook">
                <a href="https://www.facebook.com/profile.php?id=100028578055216"
                  ><i class="fa fa-facebook" aria-hidden="true" id="social"></i
                ></a>
              </div>
              <div class="twitter">
                <a href=""
                  ><i class="fa-brands fa-x-twitter" id="social"></i
                ></a>
              </div>
              <div class="instagram">
                <a href="https://www.instagram.com/el_fortin_panaderia/"
                  ><i class="fa fa-instagram" aria-hidden="true" id="social"></i
                ></a>
              </div>
              <div class="whatsapp">
                <a href=""
                  ><i class="fa fa-whatsapp" aria-hidden="true" id="social"></i
                ></a>
              </div>
            </div>
          </div>
        </div>
        <p class="site-info">&copy; 2024 Todos los derechos reservados.</p>
      </div>
    </footer>
    <script
      src="https://kit.fontawesome.com/fa85015eab.js"
      crossorigin="anonymous"
    ></script>

    <script src="js/Validaciones/charEsp.js"></script>
    <script src="js/Validaciones/letras.js"></script>
    <script src="js/Validaciones/password.js"></script>
    <script src="js/jquery.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/validacionLogin.js"></script>
    <script src="js/sweetalert2.all.min.js"></script>
    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    <script src="js/adminlte.min.js"></script>
  </body>
</html>
