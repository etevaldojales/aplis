<?php
require_once 'config/Database.php';
require_once 'models/Medico.php';

class MedicoController {
    private $db;
    private $medico;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->medico = new Medico($this->db);
    }

    public function getAll() {
        $stmt = $this->medico->read();
        $num = $stmt->rowCount();
        $medicos_arr = array();

        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                extract($row);
                $medico_item = array(
                    "id" => (int)$id,
                    "nome" => $nome,
                    "CRM" => $CRM,
                    "UFCRM" => $UFCRM
                );
                array_push($medicos_arr, $medico_item);
            }
        }
        http_response_code(200);
        echo json_encode($medicos_arr);
    }

    public function create($data) {
        $this->medico->nome = $data->nome;
        $this->medico->CRM = $data->CRM;
        $this->medico->UFCRM = $data->UFCRM;

        if($this->medico->create()) {
            http_response_code(201);
            echo json_encode("Médico criado com sucesso");
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Não foi possível criar o médico."));
        }
    }
}
?>