<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'controllers/MedicoController.php';

$controller = new MedicoController();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($uri, '/api/v1/medicos') !== false) {
    if ($method === 'GET') {
        $controller->getAll();
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        $controller->create($data);
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Método não permitido."));
    }
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Rota não encontrada."));
}
?>